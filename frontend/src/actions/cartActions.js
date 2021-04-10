import axios from 'axios'
import { 
    CART_ADD_ITEM, 
    CART_REMOVE_ITEM, 
    
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_GATEWAY

} from '../constants/cartConstants'

export const addToCart = (id, qty) => async (dispatch, getState) => {
    const config = {
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjE4MTg3MjA0LCJqdGkiOiJiNjBmNTAwY2EwMzQ0OGU4YjRiNDAyM2IwMTdjM2JmMyIsInVzZXJfaWQiOjF9.4Te0MXqMnaBWZKijhQdawKBSedBfyXACT48IuHErweI'
        }
    }

    const { data } = await axios.get(`/api/products/${id}`, config)

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    })    

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    })

    localStorage.setItem('shippingAddress', JSON.stringify(data))

}

export const savePaymentGateway = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_GATEWAY,
        payload: data
    })

    localStorage.setItem('paymentGateway', JSON.stringify(data))

}

