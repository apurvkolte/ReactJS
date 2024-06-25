import { createRouter } from 'next-connect';
import { registerUser } from '../../../controllers/authController'
import onError from '../../../middlewares/error'

const router = createRouter({ onError });

router
    .post(registerUser)

export default router.handler();



