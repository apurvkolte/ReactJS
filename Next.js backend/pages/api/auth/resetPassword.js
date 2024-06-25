import { createRouter } from 'next-connect';
import { updatePassword } from '../../../controllers/authController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser } from '../../../middlewares/auth'


const router = createRouter({ onError });


router
    .use(isAuthenticatedUser)
    .put(updatePassword)

export default router.handler();



