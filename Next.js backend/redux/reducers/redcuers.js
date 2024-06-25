import { combineReducers } from 'redux';

import {
    productsReducer, productDetailsReducer, newReviewReducer, newProductReducer, productReducer,
    productReviewsReducer, reviewReducer, productsRelatedReducer, categoryReducer, allCategoryReducer,
    newCategoryReducer, sideImageReduser, allSideImageReducer, allSiderImageReducer, topProductsReducer
} from './productReducers'
import {
    authReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer,
    allAddressReducer, addressDetailsReducer, addressReducer, defaultAddressReducer,
    verificationReducer, enquiryReducer, allAboutReducer, updateAboutReducer, allContactReducer, updateContactReducer, productEnquiryReducer
} from './userReducers';
import { cartReducer, buyReducer } from './cartReducers';
import {
    myOrdersReducer, newOrderReducer, orderDetailsReducer, allOrdersReducer, orderReducer,
    newCouponReducer, couponDetailsReducer, allCouponsReducer, getAllUserCoupons, couponDeleteReducer, cancelReducer,
    enc_requestReducer, returnReducer, cancelReturnReducer, reportsReducer, salesReducer
} from './orderReducers';

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
    updateContact: updateContactReducer,
    productEnquiry: productEnquiryReducer
})

export default reducer