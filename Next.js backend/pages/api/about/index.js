import { createRouter } from 'next-connect';
import { getAbout, updateAbout } from '../../../controllers/authController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });

router
    .get(getAbout);

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .put(updateAbout)



export default router.handler();



