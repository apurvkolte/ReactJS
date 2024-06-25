import { createRouter } from 'next-connect';
import { deleteEnquiry } from '../../../../controllers/authController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });

router.use(isAuthenticatedUser, authorizeRoles('admin'))
    .delete(deleteEnquiry);


export default router.handler();



