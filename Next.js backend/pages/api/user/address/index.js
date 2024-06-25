import { createRouter } from 'next-connect';
import { getAddressDetails, addAddress } from '../../../../controllers/authController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'

const router = createRouter({ onError });


router
    .use(isAuthenticatedUser)
    .post(addAddress);


export default router.handler();



