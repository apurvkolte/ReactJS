import { createRouter } from 'next-connect';
import { myOrders } from '../../../controllers/orderController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'


const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .get(myOrders);



export default router.handler();



