import { createRouter } from 'next-connect';
import { forgotPassword } from '../../../controllers/authController'
import onError from '../../../middlewares/error'

const router = createRouter({ onError });

router
    .post(forgotPassword)

export default router.handler();



