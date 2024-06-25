import { createRouter } from 'next-connect';
import { cancelOrder } from '../../../../controllers/orderController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .put(cancelOrder);



export default router.handler();



