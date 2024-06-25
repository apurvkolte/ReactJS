import { createRouter } from 'next-connect';
import { getSingleProduct } from '../../../controllers/productController'
import onError from '../../../middlewares/error'

const router = createRouter({ onError });

router
    .get(getSingleProduct);



export default router.handler();



