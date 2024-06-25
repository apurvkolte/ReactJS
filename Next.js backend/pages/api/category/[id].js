import { createRouter } from 'next-connect';
import { deleteCategory, updateCategory } from '../../../controllers/productController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'
import { banner_category } from '../../../utils/banner_category';

const router = createRouter({ onError });


router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .delete(deleteCategory);


router.use(banner_category.array('file'));
router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .put(updateCategory)


export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
}


export default router.handler();