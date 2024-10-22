import { Router } from "express";
import { InteractiveController } from "../controllers/interactive.controller";

const router = Router();
const interactiveController = new InteractiveController();

router.post('/like/:id_place', interactiveController.setLike.bind(interactiveController));
router.post('/dislike/:id_place', interactiveController.setDislike.bind(interactiveController));

export default router;