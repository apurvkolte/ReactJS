import { createRouter } from 'next-connect';
import { getCategory, addCategory, updateCategory, deleteCategory } from '../../../controllers/productController'
import onError from '../../../middlewares/error'
import { banner_category } from '../../../utils/banner_category';
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'

const router = createRouter({ onError });

router
    .get(getCategory);

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .delete(deleteCategory);


router.use(banner_category.array('file'));

router
    .use(isAuthenticatedUser, authorizeRoles('admin'))
    .post(addCategory);





export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
}

export default router.handler();



