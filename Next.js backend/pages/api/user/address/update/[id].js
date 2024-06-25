import { createRouter } from 'next-connect';
import { getAddressDetails, updateAddress } from '../../../../../controllers/authController'
import onError from '../../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../../middlewares/auth'

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .put(updateAddress)


router
    .use(isAuthenticatedUser)
    .get(getAddressDetails);


export default router.handler();



