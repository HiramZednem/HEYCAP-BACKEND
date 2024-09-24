import { Router } from 'express';
import { itineraryController } from '../controllers';


const router = Router();

router.get('/user/:userid', itineraryController.getAll);
router.get('/:id',  itineraryController.getById);
router.post('/:userid', itineraryController.create);
router.put('/:id',  itineraryController.update);
router.delete('/:id',  itineraryController.delete);


export default router;
