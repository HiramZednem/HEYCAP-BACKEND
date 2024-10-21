import { Router } from "express";
import { PlaceController } from "../controllers/place.controller";

const router = Router();
const placeController = new PlaceController();

// router.get("/", placeController.getPlaces.bind(placeController));
// router.get("/in-order", placeController.getPlacesInOrder.bind(placeController));
// router.post("/", placeController.registerPlace.bind(placeController));
// router.delete("/:id_place", placeController.deletePlace.bind(placeController));

router.get("/:id_place", placeController.getPlaceByiD.bind(placeController));
router.get("/nearbyplaces", placeController.getNearbyPlaces.bind(placeController));
router.post("/:id_place/like", placeController.likePlace.bind(placeController));
router.post("/:id_place/dislike", placeController.dislikePlace.bind(placeController));

export default router;