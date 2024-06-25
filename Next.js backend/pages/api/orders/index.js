import { createRouter } from 'next-connect';
import { myOrders, createOrder } from '../../../controllers/orderController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'


const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .get(myOrders);

router
    .use(isAuthenticatedUser)
    .post(createOrder);



export default router.handler();



