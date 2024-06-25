import { createRouter } from 'next-connect';
import { updateCheckoutStock } from '../../../controllers/productController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });


router
    .use(isAuthenticatedUser)
    .put(updateCheckoutStock);



export default router.handler();
