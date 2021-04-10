import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { cartReducer } from './reducers/cartReducers'
import { 
        productListReducers, 
        productDetailsReducers,
        productDeleteReducers,
        productCreateReducers,
        productUpdateReducers,
        productReviewCreateReducers,
        produtTopRatedReducer
} from './reducers/productReducers'
import { 
        userLoginReducer, 
        userRegisterReducer, 
        userDetailsReducer, 
        userUpdateProfileReducer,
        userListReducer,
        userDeleteReducer,
        userUpdateReducer
} from './reducers/userReducers'
import { 
        orderCreateReducers, 
        orderDetailsReducer, 
        orderPayReducer,
        orderListReducer,
        orderListAllReducer,
        orderDeliveredReducer
} from './reducers/orderReducers'

const reducer = combineReducers({
        cart: cartReducer,

        productList: productListReducers,
        productDetails: productDetailsReducers,
        productDelete: productDeleteReducers,
        productCreate: productCreateReducers,
        productUpdate: productUpdateReducers,
        productReviewCreate: productReviewCreateReducers,
        productTopRated: produtTopRatedReducer,

        userLogin: userLoginReducer,
        userRegister: userRegisterReducer,
        userDetails: userDetailsReducer,
        userUpdateProfile: userUpdateProfileReducer,
        usersList: userListReducer,
        userDelete: userDeleteReducer,
        userUpdate: userUpdateReducer,

        orderCreate: orderCreateReducers,
        orderDetails: orderDetailsReducer,
        orderPay: orderPayReducer,
        orderDelivered: orderDeliveredReducer,
        orderListMy: orderListReducer,
        orderList: orderListAllReducer,
        
})

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
        JSON.parse(localStorage.getItem('cartItems')) : []

const userInfoFromStorage = localStorage.getItem('userInfo') ?
        JSON.parse(localStorage.getItem('userInfo')) : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
        JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
        cart: {
                cartItems: cartItemsFromStorage,
                shippingAddress: shippingAddressFromStorage
        },
        userLogin: { userInfo: userInfoFromStorage }
}
const middleware = [thunk]

const store = createStore(
        reducer, initialState,
        composeWithDevTools(applyMiddleware(...middleware))
)

export default store
