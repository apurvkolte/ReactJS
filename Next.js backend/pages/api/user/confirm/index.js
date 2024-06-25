import { createRouter } from 'next-connect';
import { emailVerification } from '../../../../controllers/authController'
import onError from '../../../../middlewares/error'
import { upload } from '../../../../utils/product-upload';

import { isAuthenticatedUser, authorizeRoles } from '../../../../middlewares/auth'

const router = createRouter({ onError });
router.use(upload.array('file'));
router
    .use(isAuthenticatedUser)
    .post(emailVerification);

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
}

export default router.handler();



