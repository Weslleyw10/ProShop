import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { PayPalButton } from 'react-paypal-button-v2'

import Loader from '../components/Loader'
import Message from '../components/Message'

import { getOrderDetails, payOrder, deliveredOrder } from '../actions/ordersActions'
import { ORDER_PAY_RESET, ORDER_DELIVERED_RESET } from '../constants/orderConstants'

export default function OrderScreen({ match, history }) {
    const orderId = match.params.id

    const dispatch = useDispatch()

    const [sdkReady, setSdkReady] = useState(false)

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading:loadingPay, success:successPay } = orderPay

    const orderDelivered = useSelector(state => state.orderDelivered)
    const { loading:loadingDelivered, success:successDelivered } = orderDelivered

    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AXpC-IkajJVuFf8K20NodmLZR3_EEGEvLFgrhHjUtpyDQMgMmi--K6f8O-b0g2hzz5Y1gz6pF3Qo0euO&currency=BRL'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    useEffect(() => {

        if(!userInfo) {
            history.push('/login')
        }


        if (!order || successPay || successDelivered || order._id !== Number(orderId)) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVERED_RESET })
            dispatch(getOrderDetails(orderId))
        } else if(!order.isPaid) {
            if(!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, order, orderId, successPay, successDelivered])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliveredHandler = () => {
        dispatch(deliveredOrder(order))
    }

    return loading ? (
        <Loader />

    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
        <div>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong>{order.user.name}</p>
                            <p><strong>Email: </strong>{order.user.email}</p>
                            <p>
                                <strong>Shipping: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city},
                                {' '}
                                {order.shippingAddress.postalCode},
                                {' '}
                                {order.shippingAddress.country}
                            </p>

                            {
                                order.isDelivered ? (
                                    <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                ) : (
                                    <Message variant='warning'>Not Delivered</Message>
                                )
                            }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>

                            {order.isPaid ? (
                                <Message variant='success'>Paid on {order.paidAt}</Message>
                            ) : (
                                <Message variant='warning'>Not Paid</Message>
                            )}

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {
                                order.orderItems.length === 0 ?
                                    <Message variant='info'>
                                        Order is empty
                                    </Message> :
                                    (
                                        <ListGroup variant='flush'>
                                            {
                                                order.orderItems.map((item, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <Row>
                                                            <Col md={1}>
                                                                <Image src={item.image} alt={item.name} fluid rounded />
                                                            </Col>

                                                            <Col>
                                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                            </Col>

                                                            <Col md={4}>
                                                                {item.qty} X {item.price} = {(item.qty * item.price).toFixed(2)}
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))
                                            }
                                        </ListGroup>
                                    )
                            }
                        </ListGroup.Item>

                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Item:</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}

                                    {!sdkReady ? (
                                        <Loader />
                                    ) : (
                                        <PayPalButton 
                                            amount={order.totalPrice}
                                            currency={'BRL'}
                                            onSuccess={successPaymentHandler}
                                        />
                                        
                                    )}
                                </ListGroup.Item>
                            )}
                        </ListGroup>

                        {loadingDelivered && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn btn-block'
                                    onClick={deliveredHandler}
                                >
                                    Marker Delivered
                                </Button>
                            </ListGroup.Item>
                        )}

                    </Card>
                </Col>
            </Row>
        </div>
    )
}
