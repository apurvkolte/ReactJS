import { createRouter } from 'next-connect';
// import connection from '../../../config/connection'
import { allOrders } from '../../../../controllers/orderController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });



router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .get(allOrders);



export default router.handler();



