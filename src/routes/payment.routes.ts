import { Router } from "express";
import { PaymentController } from "../controllers";

const router = Router();
const paymentController = new PaymentController();

router.get("/create-page", paymentController.create);
router.get("/success", paymentController.success);

export default router;