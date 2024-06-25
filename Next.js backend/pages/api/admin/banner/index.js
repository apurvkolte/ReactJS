import { createRouter } from 'next-connect';
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'
import { getSiderImage } from '../../../../controllers/productController'


const router = createRouter({ onError });


router
    .use(isAuthenticatedUser)
    .get(getSiderImage, authorizeRoles('admin'));



export default router.handler();