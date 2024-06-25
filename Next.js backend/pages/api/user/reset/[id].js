import { createRouter } from 'next-connect';
import { resetPassword } from '../../../../controllers/authController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .put(resetPassword);


export default router.handler();



