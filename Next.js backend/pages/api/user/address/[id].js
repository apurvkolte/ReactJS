import { createRouter } from 'next-connect';
import { deleteAddress, allAddress } from '../../../../controllers/authController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'

const router = createRouter({ onError });


router
    .use(isAuthenticatedUser)
    .get(allAddress);


router
    .use(isAuthenticatedUser)
    .delete(deleteAddress);


export default router.handler();



