import { Router } from 'express';
import { gymController } from '../controllers';

const router = Router();

router.get('/', gymController.getAll);
router.get('/:id', gymController.getById);
router.post('/', gymController.create);
router.put('/:id', gymController.update);
router.delete('/:id', gymController.delete);

export default router;
