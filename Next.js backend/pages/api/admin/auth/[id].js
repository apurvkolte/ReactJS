import { createRouter } from 'next-connect';
import { updateUser, deleteUser, getUserProfile } from '../../../../controllers/authController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .get(getUserProfile);

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .delete(deleteUser);

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .put(updateUser)

export default router.handler();



