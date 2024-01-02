import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import {
    productsReducer, productDetailsReducer, newReviewReducer, newProductReducer, productReducer,
    productReviewsReducer, reviewReducer, productsRelatedReducer, categoryReducer, allCategoryReducer,
    newCategoryReducer, sideImageReduser, allSideImageReducer, allSiderImageReducer, topProductsReducer
} from './reducers/productReducers'
import {
    authReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer,
    allAddressReducer, addressDetailsReducer, addressReducer, defaultAddressReducer,
    verificationReducer, enquiryReducer, allAboutReducer, updateAboutReducer, allContactReducer, updateContactReducer
} from './reducers/userReducers';
import { cartReducer, buyReducer } from './reducers/cartReducers';
import {
    myOrdersReducer, newOrderReducer, orderDetailsReducer, allOrdersReducer, orderReducer,
    newCouponReducer, couponDetailsReducer, allCouponsReducer, getAllUserCoupons, couponDeleteReducer, cancelReducer,
    enc_requestReducer, returnReducer, cancelReturnReducer, reportsReducer, salesReducer
} from './reducers/orderReducers';

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
    enc_request: enc_requestReducer,
    sideImage: sideImageReduser,
    allSideImage: allSideImageReducer,
    allSiderImage: allSiderImageReducer,
    topProducts: topProductsReducer,
    reports: reportsReducer,
    sales: salesReducer,
    about: allAboutReducer,
    updateAbout: updateAboutReducer,
    contact: allContactReducer,
    updateContact: updateContactReducer
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


const middleware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;