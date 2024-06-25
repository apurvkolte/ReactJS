import { createRouter } from 'next-connect';
import { getOrderDetails } from '../../../../controllers/orderController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .get(getOrderDetails);



export default router.handler();



