import { createRouter } from 'next-connect';
// import connection from '../../../config/connection'
import { allCoupons } from '../../../../controllers/orderController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .get(allCoupons);



export default router.handler();



