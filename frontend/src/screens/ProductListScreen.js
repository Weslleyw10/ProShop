import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'

import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'

import { useDispatch, useSelector } from 'react-redux'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

export default function ProductListScreen({ history, match }) {
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productList = useSelector(state => state.productList)
    const { products, loading, error, page, pages } = productList

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate

    let keyword = history.location.search

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })

        if (!userInfo.isAdmin) {
            history.push('/login')
        }

        if (successCreate) {
            console.log('Product Created:')
            history.push(`/admin/product/${createdProduct._id}/edit`)
        } else {
            dispatch(listProducts(keyword))
        }

    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct, keyword])

    // Delete Product
    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id))
        }
    }

    // Create Product
    const createProductHandler = () => {
        dispatch(createProduct())
    }

    return (
        <div>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

            {
                loading ? (<Loader />) :
                    error ? (<Message variant='danger'>{error}</Message>) :
                        (
                            <div>
                                <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th>Brand</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            products.map(product => (
                                                <tr key={product._id}>
                                                    <td>{product._id}</td>
                                                    <td>{product.name}</td>
                                                    <td>${product.price}</td>
                                                    <td>{product.categoy}</td>
                                                    <td>{product.brand}</td>

                                                    <td>
                                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                            <Button variant='light' className='btn-sm'>
                                                                <i className='fas fa-edit'></i>
                                                            </Button>
                                                        </LinkContainer>

                                                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                                            <i className='fas fa-trash'></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                                <Paginate page={page} pages={pages} isAdmin={true}/>
                            </div>
                        )
            }


        </div>
    )
}
