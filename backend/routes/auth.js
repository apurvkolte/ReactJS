const express = require('express');
const router = express.Router();
const { upload } = require('../utils/image-upload');
const fileUpload = require('express-fileupload');
const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    allAddress,
    getAddressDetails,
    updateAddress,
    deleteAddress,
    addAddress,
    defaultAddress,
    emailVarification,
    getDefaultAddress,
    sharePromocode,
    downlaod,
    sendEnquiry

} = require('../controllers/authController');


const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/register').post(upload.single('file'), registerUser);
router.route('/email/confirm').post(upload.single('file'), emailVarification);
router.route('/login').post(loginUser);

router.route('/admin/coupons/share/:id').post(isAuthenticatedUser, authorizeRoles('admin'), sharePromocode);

router.route('/password/forgot').post(fileUpload(), forgotPassword)
router.route('/password/reset/:token').put(fileUpload(), resetPassword)
// router.route('/password/reset/:id').put(resetPassword)

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser, getUserProfile)
router.route('/password/update').put(isAuthenticatedUser, fileUpload(), updatePassword)
router.route('/me/update').put(isAuthenticatedUser, upload.single('file'), updateProfile)

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers)
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)

router.route('/me/update/myaddress/:id')
    .get(isAuthenticatedUser, getAddressDetails)
    .put(isAuthenticatedUser, fileUpload(), updateAddress)
    .delete(isAuthenticatedUser, deleteAddress)
router.route('/me/update/address/:id').get(isAuthenticatedUser, allAddress)
router.route('/me/update/address/new').post(isAuthenticatedUser, fileUpload(), addAddress)
router.route('/me/update/myaddress/default/:id').get(isAuthenticatedUser, defaultAddress)
router.route('/enquiry').post(sendEnquiry)
router.route('/admin/downlaod/db').get(isAuthenticatedUser, authorizeRoles('admin'), downlaod)


module.exports = router;