import { createRouter } from 'next-connect';
import { cancelReturnOrder } from '../../../../controllers/orderController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .put(cancelReturnOrder);



export default router.handler();



