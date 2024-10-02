import { Router } from "express";
import { InteractiveController } from "../controllers/interactive.controller";

const router = Router();
const interactiveController = new InteractiveController();

router.post('/like', interactiveController.setLike.bind(interactiveController));
router.post('/dislike', interactiveController.setDislike.bind(interactiveController));

export default router;