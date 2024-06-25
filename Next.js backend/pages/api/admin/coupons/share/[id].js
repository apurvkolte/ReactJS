import { createRouter } from 'next-connect';
// import connection from '../../../config/connection'
import { sharePromocode } from '../../../../../controllers/authController'
import onError from '../../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../../middlewares/auth'

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .post(sharePromocode);




export default router.handler();



