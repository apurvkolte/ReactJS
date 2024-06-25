import { createRouter } from 'next-connect';
import onError from '../../../../middlewares/error'
import { upload_banner } from '../../../../utils/banner-upload';
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'
import { updateBanner, deleteBanner, } from '../../../../controllers/productController'


const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .get(deleteBanner, authorizeRoles('admin'));


router.use(upload_banner.array('file'));

router
    .use(isAuthenticatedUser)
    .put(updateBanner, authorizeRoles('admin'));


export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
}

export default router.handler();