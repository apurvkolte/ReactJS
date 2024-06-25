import { createRouter } from 'next-connect';
import { allEnquiry } from '../../../../controllers/authController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });



router.use(isAuthenticatedUser, authorizeRoles('admin'))
    .get(allEnquiry);



export default router.handler();



