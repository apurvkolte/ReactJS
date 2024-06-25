import { createRouter } from 'next-connect';
// import connection from '../../../../config/connection'
import { updateUser } from '../../../../controllers/authController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'

const router = createRouter({ onError });


router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .put(updateUser);


export default router.handler();



