import { createRouter } from 'next-connect';
import { getProductReviews } from '../../../controllers/productController'
import onError from '../../../middlewares/error'

const router = createRouter({ onError });

router.get(getProductReviews)

export default router.handler();