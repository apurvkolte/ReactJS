import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import {
    productsReducer, productDetailsReducer, newReviewReducer, newProductReducer, productReducer,
    productReviewsReducer, reviewReducer, productsRelatedReducer, categoryReducer, allCategoryReducer,
    newCategoryReducer, topProductsReducer
} from './reducers/productReducers'
import {
    authReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer,
    allAddressReducer, addressDetailsReducer, addressReducer, defaultAddressReducer,
    verificationReducer, enquiryReducer, allAboutReducer, updateAboutReducer, allContactReducer, updateContactReducer, productEnquiryReducer
} from './reducers/userReducers';
import { cartReducer, buyReducer } from './reducers/cartReducers';
import {
    myOrdersReducer, newOrderReducer, orderDetailsReducer, allOrdersReducer, orderReducer,
    newCouponReducer, couponDetailsReducer, allCouponsReducer, getAllUserCoupons, couponDeleteReducer, cancelReducer
    , returnReducer, cancelReturnReducer, reportsReducer, salesReducer
} from './reducers/orderReducers';
const thunkMiddleware = require('redux-thunk').default;

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    newProduct: newProductReducer,
    product: productReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
    auth: authReducer,
    user: userReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    forgotPassword: forgotPasswordReducer,
    order: orderReducer,
    cart: cartReducer,
    buy: buyReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    allOrders: allOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    productsRelated: productsRelatedReducer,
    allCategory: allCategoryReducer,
    category: categoryReducer,
    newCategory: newCategoryReducer,
    allAddress: allAddressReducer,
    addressDetails: addressDetailsReducer,
    address: addressReducer,
    defaultAddress: defaultAddressReducer,
    verification: verificationReducer,
    newCoupon: newCouponReducer,
    couponDetails: couponDetailsReducer,
    allCoupons: allCouponsReducer,
    allUserCoupons: getAllUserCoupons,
    couponDelete: couponDeleteReducer,
    cancel: cancelReducer,
    return: returnReducer,
    cancelReturn: cancelReturnReducer,
    enquiry: enquiryReducer,
    topProducts: topProductsReducer,
    reports: reportsReducer,
    sales: salesReducer,
    about: allAboutReducer,
    updateAbout: updateAboutReducer,
    contact: allContactReducer,
    updateContact: updateContactReducer,
    productEnquiry: productEnquiryReducer
})


const ISSERVER = typeof window === "undefined";
var initialState;
if (!ISSERVER) {
    initialState = {
        cart: {
            cartItems: localStorage.getItem('cartItems')
                ? JSON.parse(localStorage.getItem('cartItems'))
                : [],
            buyItem: localStorage.getItem('buyItem')
                ? JSON.parse(localStorage.getItem('buyItem'))
                : [],
            shippingInfo: localStorage.getItem('shippingInfo')
                ? JSON.parse(localStorage.getItem('shippingInfo'))
                : {}
        }
    }

}


const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))

export default store;