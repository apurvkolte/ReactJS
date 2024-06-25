import { createRouter } from 'next-connect';
import { forgotPassword } from '../../../controllers/authController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .post(forgotPassword)

export default router.handler();