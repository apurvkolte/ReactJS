import { createRouter } from 'next-connect';
// import connection from '../../../../config/connection'
import { updateProduct, deleteProduct, getSingleProduct } from '../../../../controllers/productController'
import onError from '../../../../middlewares/error'
import { upload } from '../../../../utils/product-upload';
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'

const router = createRouter({ onError });


router.get(getSingleProduct);

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .delete(deleteProduct);

router.use(upload.array('file'));

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .put(updateProduct);

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
}

export default router.handler();