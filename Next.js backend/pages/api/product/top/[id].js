import { createRouter } from 'next-connect';
import { topProduct } from '../../../../controllers/productController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .get(topProduct);


export default router.handler();



