import { createRouter } from 'next-connect';
import { returnOrder } from '../../../../controllers/orderController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .put(returnOrder);



export default router.handler();



