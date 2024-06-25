import { createRouter } from 'next-connect';
import { updateProfile } from '../../../controllers/authController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });


router
    .use(isAuthenticatedUser)
    .put(updateProfile)

export default router.handler();



