import { createRouter } from 'next-connect';
import { resetPassword } from '../../../controllers/authController'
import onError from '../../../middlewares/error'

const router = createRouter({ onError });

router
    .put(resetPassword)

export default router.handler();



