import { createRouter } from 'next-connect';
import { getUserProfile } from '../../../controllers/authController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });


router
    .use(isAuthenticatedUser)
    .get(getUserProfile)

export default router.handler();



