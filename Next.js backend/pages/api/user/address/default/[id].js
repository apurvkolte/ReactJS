import { createRouter } from 'next-connect';
import { defaultAddress } from '../../../../../controllers/authController'
import onError from '../../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../../middlewares/auth'

const router = createRouter({ onError });


router
    .use(isAuthenticatedUser)
    .get(defaultAddress);


export default router.handler();



