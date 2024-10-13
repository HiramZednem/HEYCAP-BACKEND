import { Router } from 'express';
import { notificationController } from '../controllers';
import { accessTokenAuth } from '../middlewares/jwtAuth';

const router = Router();

router.post('/verifynumber/:id', accessTokenAuth, notificationController.verifyNumberPost);
router.get('/verifynumber/:id/:code', accessTokenAuth, notificationController.verifyNumberGet);
router.post('/forgotpassword', notificationController.forgotPassword);
router.get('/forgotpassword/:code', notificationController.forgotPasswordGet);
router.get('/login/:code', accessTokenAuth, notificationController.authLogin);

export default router;
