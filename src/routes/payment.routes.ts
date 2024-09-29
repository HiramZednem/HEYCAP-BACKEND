import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();
const paymentController = new PaymentController();

router.get("/create-page", paymentController.create.bind(paymentController));
router.get("/success", paymentController.success.bind(paymentController));
router.post("/notification", paymentController.notification.bind(paymentController));


export default router;