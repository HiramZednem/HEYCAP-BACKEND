import { Router } from 'express';
import { notificationController } from '../controllers';
import { accessTokenAuth } from '../middlewares/jwtAuth';

const router = Router();

router.post('/verifynumber/', accessTokenAuth, notificationController.verifyNumberPost);
router.get('/verifynumber/:code', accessTokenAuth, notificationController.verifyNumberGet);
router.post('/forgotpassword', notificationController.forgotPassword);
router.get('/forgotpassword/:code', notificationController.forgotPasswordGet);
router.get('/login/:code', accessTokenAuth, notificationController.authLoginGet);
router.post('/login/', accessTokenAuth, notificationController.authLoginPost);


export default router;
