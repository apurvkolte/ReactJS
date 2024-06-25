import { createRouter } from 'next-connect';
import { sendEnquiry } from '../../../controllers/authController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .post(sendEnquiry);


export default router.handler();



