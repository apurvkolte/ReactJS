import { createRouter } from 'next-connect';
// import connection from '../../../config/connection'
import { createCoupon, allCoupons, deleteCoupon } from '../../../../controllers/orderController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .get(allCoupons);

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .post(createCoupon);
router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .delete(deleteCoupon);





export default router.handler();



