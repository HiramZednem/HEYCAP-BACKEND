import { Router } from "express";
import { FollowController } from "../controllers/follow.controller";


const router = Router();
const followController = new FollowController();


router.post("/:id_followed", followController.follow.bind(followController));
router.delete("/:id_followed", followController.unfollow.bind(followController))
router.get("/:id_user", followController.getFollowers.bind(followController))

export default router;