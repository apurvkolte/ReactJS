import { createRouter } from 'next-connect';
import { invoicePdf } from '../../../controllers/orderController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });


router
    .use(isAuthenticatedUser)
    .get(invoicePdf);


export default router.handler();