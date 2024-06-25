import { createRouter } from 'next-connect';
import { getContact, updateContact } from '../../../controllers/authController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });

router
    .get(getContact);

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .put(updateContact)



export default router.handler();



