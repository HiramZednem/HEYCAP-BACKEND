import { Router } from 'express';
import { userController } from '../controllers';
import { accessTokenAuth } from '../middlewares/jwtAuth';

const router = Router();

router.get('/', accessTokenAuth, userController.getAll);
router.get('/:id',accessTokenAuth,  userController.getById);
router.post('/', userController.create);
router.put('/:id', accessTokenAuth,  userController.update);
router.delete('/:id', accessTokenAuth,  userController.delete);
router.post('/login', userController.login);
router.post('/verifynumber/:id', accessTokenAuth, userController.verifyNumberPost);
router.get('/verifynumber/:id/:code', accessTokenAuth, userController.verifyNumberGet);

export default router;
