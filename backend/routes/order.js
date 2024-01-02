const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();

const { createOrder, getOrderDetails, myOrders, allOrders, updateOrder, deleteOrder, allCoupons, createCoupon,
    deleteCoupon, getCouponDetails, updateCoupon, cancelOrder, returnOrder, cancelReturnOrder, invoicePdf, allReport,
    sales } = require('../controllers/orderController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')
const ccavReqHandler = require('../controllers/ccavRequestHandler');
const ccavResHandler = require('../controllers/ccavResponseHandler');


router.route('/order/new').post(isAuthenticatedUser, createOrder);

router.route('/ccavRequestHandler').post(function (request, response) {
    ccavReqHandler.postReq(request, response);
});
router.route('/ccavResponseHandler').post(function (request, response) {
    ccavResHandler.postRes(request, response);
});

router.route('/order/:id').get(isAuthenticatedUser, getOrderDetails);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), allOrders);
router.route('/admin/order/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

router.route('/admin/order/cancel/:id').put(isAuthenticatedUser, cancelOrder)
router.route('/admin/order/return/:id').put(isAuthenticatedUser, returnOrder)
router.route('/admin/order/cancelReturn/:id').put(isAuthenticatedUser, cancelReturnOrder)

router.route('/admin/coupons').get(isAuthenticatedUser, authorizeRoles('admin'), allCoupons);
router.route('/user/couponsAll').get(isAuthenticatedUser, allCoupons);
router.route('/admin/coupons/:id').get(isAuthenticatedUser, getCouponDetails);
router.route('/admin/coupon/new').post(isAuthenticatedUser, authorizeRoles('admin'), fileUpload(), createCoupon);
router.route('/admin/coupon/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCoupon)
    .put(isAuthenticatedUser, authorizeRoles('admin'), fileUpload(), updateCoupon);

router.route('/invoice/:id').get(isAuthenticatedUser, invoicePdf)

router.route('/admin/report').put(isAuthenticatedUser, authorizeRoles('admin'), allReport);
router.route('/admin/sales').get(isAuthenticatedUser, authorizeRoles('admin'), sales);

module.exports = router;
