import { createRouter } from 'next-connect';
import { createOrder } from '../../../controllers/razorpay'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser } from '../../../middlewares/auth'

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .post(createOrder);


export const config = {
    api: {
        bodyParser: true, // Disallow body parsing, consume as stream
    },
}

export default router.handler();
