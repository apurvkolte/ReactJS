import { createRouter } from 'next-connect';
// import connection from '../../../config/connection'
import { getCouponDetails, updateCoupon, deleteCoupon } from '../../../../controllers/orderController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });



router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .get(getCouponDetails);

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .put(updateCoupon);

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .delete(deleteCoupon);




export default router.handler();



