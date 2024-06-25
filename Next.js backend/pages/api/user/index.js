import { createRouter } from 'next-connect';
import { getUserProfile1, registerUser, updateProfile } from '../../../controllers/authController'
import onError from '../../../middlewares/error'
import { isAuthenticatedUser, authorizeRoles } from '../../../middlewares/auth'
import { upload } from '../../../utils/image-upload';

const router = createRouter({ onError });

router
    .use(isAuthenticatedUser)
    .get(getUserProfile1);

router
    .use(isAuthenticatedUser)
    .put(updateProfile)


router.use(upload.array('file'));
router
    .use(isAuthenticatedUser)
    .post(registerUser);


export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
}

export default router.handler();



