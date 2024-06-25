import { createRouter } from 'next-connect';
import { createProductReview, deleteReview } from '../../../controllers/productController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });


router
    .use(isAuthenticatedUser)
    .put(createProductReview);
router
    .use(isAuthenticatedUser)
    .delete(deleteReview);

export const config = {
    api: {
        bodyParser: true, // Disallow body parsing, consume as stream
    },
}

export default router.handler();



