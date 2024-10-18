import { Router } from 'express';
import { userController } from '../controllers';
import { accessTokenAuth } from '../middlewares/jwtAuth';

const router = Router();

router.get('/:id',accessTokenAuth,  userController.getById);
router.post('/', userController.create);
router.put('/', accessTokenAuth,  userController.update);
router.delete('/', accessTokenAuth,  userController.delete);
router.post('/login', userController.login);
router.patch('/password', userController.updatePassword);

export default router;
