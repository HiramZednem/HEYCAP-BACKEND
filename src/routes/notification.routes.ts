import { Router } from 'express';
import { notificationController } from '../controllers';
import { accessTokenAuth } from '../middlewares/jwtAuth';

const router = Router();

router.post('/verifynumber/', accessTokenAuth, notificationController.verifyNumberResendCode);
router.post('/verifynumber/:code', accessTokenAuth, notificationController.verifyNumberWithCode);
router.post('/forgotpassword', notificationController.forgotPassword);
router.post('/forgotpassword/:code', notificationController.forgotPasswordGet);
router.post('/login/:code', accessTokenAuth, notificationController.authLogin);


export default router;
