import { createRouter } from 'next-connect';
// import connection from '../../../config/connection'
import { updateOrder, deleteOrder } from '../../../../controllers/orderController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });



router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .put(updateOrder);

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .put(deleteOrder);



export default router.handler();



