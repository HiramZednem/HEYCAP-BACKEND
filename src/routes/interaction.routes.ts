import { Router } from "express";
import { InteractiveController } from "../controllers/interaction.controller";

const router = Router();
const interactiveController = new InteractiveController();

router.post('/like/:id_place', interactiveController.setLike.bind(interactiveController));
router.post('/dislike/:id_place', interactiveController.setDislike.bind(interactiveController));
router.get('/places/:place_id', interactiveController.getInterractionsByPlace.bind(interactiveController));
router.get('/users/:user_id', interactiveController.getInterractionsByUser.bind(interactiveController));
router.post('/comments/:place_id', interactiveController.createComment.bind(interactiveController));

export default router;