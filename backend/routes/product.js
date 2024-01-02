const express = require('express');
const router = express.Router();
const { upload } = require('../utils/product-upload');
const { upload_banner } = require('../utils/banner-upload');
const fileUpload = require('express-fileupload');

const {
        getProducts,
        getAdminProducts,
        newProduct,
        getSingleProduct,
        updateProduct,
        deleteProduct,
        createProductReview,
        getProductReviews,
        deleteReview,
        getCategory,
        addCategory,
        deleteCategory,
        updateCategory,
        updateBanner,
        updateSideImage,
        getSideImage,
        getSiderImage,
        updateCheckoutStock,
        deleteBanner,
        deleteSideImage,
        topProduct

} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/products').get(getProducts);
router.route('/admin/products').get(getAdminProducts);

router.route('/product-details/:id').get(getSingleProduct);

router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'),
        upload.array('file'), newProduct);

router.route('/admin/product/:id')
        .put(isAuthenticatedUser, authorizeRoles('admin'), upload.array('file'), updateProduct)
        .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews').get(isAuthenticatedUser, getProductReviews)
router.route('/reviews').delete(isAuthenticatedUser, deleteReview)

router.route('/admin/category/new').post(isAuthenticatedUser, authorizeRoles('admin'), fileUpload(), addCategory)
router.route('/admin/category').get(getCategory)
router.route('/admin/category/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCategory)
        .put(isAuthenticatedUser, authorizeRoles('admin'), fileUpload(), updateCategory)

router.route('/update/banner/:id').put(isAuthenticatedUser, authorizeRoles('admin'), upload_banner.array('file'), updateBanner)
router.route('/update/side/images/:id').put(isAuthenticatedUser, authorizeRoles('admin'), upload_banner.array('file'), updateSideImage)
router.route('/delete/banner/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteBanner)
router.route('/delete/side/images/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteSideImage)
router.route('/update/side/images/get').get(getSideImage)
router.route('/update/sider/images/get').get(getSiderImage)
router.route('/checkout/update').put(isAuthenticatedUser, updateCheckoutStock)
router.route('/top/product/:id').get(isAuthenticatedUser, topProduct)
module.exports = router;