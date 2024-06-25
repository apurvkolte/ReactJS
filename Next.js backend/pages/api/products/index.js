import { createRouter } from 'next-connect';
import { getProducts } from '../../../controllers/productController'
import onError from '../../../middlewares/error'

const router = createRouter({ onError });

router
    .get(getProducts);


export default router.handler();



