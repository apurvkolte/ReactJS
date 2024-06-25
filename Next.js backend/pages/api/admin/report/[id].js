import { createRouter } from 'next-connect';
import { allReport } from '../../../../controllers/orderController'
import onError from '../../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'


const router = createRouter({ onError });


router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .put(allReport);



export default router.handler();



