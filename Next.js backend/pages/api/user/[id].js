import { createRouter } from 'next-connect';
import { deleteUser, getUserProfile1 } from '../../../controllers/authController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });


router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .get(getUserProfile1);


router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .delete(deleteUser)


export default router.handler();



