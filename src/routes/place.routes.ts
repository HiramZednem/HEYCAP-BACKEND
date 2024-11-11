import { Router } from "express";
import { PlaceController } from "../controllers/place.controller";

const router = Router();
const placeController = new PlaceController();


router.get("/nearbyplaces", placeController.getNearbyPlaces.bind(placeController));
router.get("/search", placeController.searchPlace.bind(placeController));
router.get("/:id_place", placeController.getPlaceByiD.bind(placeController));

export default router;