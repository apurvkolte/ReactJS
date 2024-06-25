import { createRouter } from 'next-connect';
import { allUsers } from '../../../controllers/authController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .get(allUsers);


export default router.handler();



