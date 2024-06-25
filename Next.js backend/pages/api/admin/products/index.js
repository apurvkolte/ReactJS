import { createRouter } from 'next-connect';
import { newProduct, getAdminProducts } from '../../../../controllers/productController'
import onError from '../../../../middlewares/error'
import { upload } from '../../../../utils/product-upload';
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .get(getAdminProducts);

router.use(upload.array('file'));

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .post(newProduct);

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
}

export default router.handler();



