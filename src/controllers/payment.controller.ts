import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { BaseResponse } from './base.response';

export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    public async create(req: Request, res: Response) {
        const { name, quantity, price } = req.query;
        // const name = 'Producto de prueba', quantity = 1, price = 100;
        console.log({ name, quantity, price });
        try {
            const result = await this.paymentService.createProduct(name as string, Number(quantity), Number(price));
            // const result = await this.paymentService.createProduct(name, quantity, price);
            res.status(200).send(`<a href="${result}">Pagar</a>`);
        } catch (error) {
            const response = new BaseResponse({}, false, 'Error creating product');
            res.status(500).json(response.toResponseEntity());
        }
    }

    public success(req: Request, res: Response) {
        res.send('Pago exitoso');
    }

    public notification(req: Request, res: Response) {
        try {
            const { query } = req;
            console.log({ query });
            const topic = query.topic || query.type;
            console.log({ topic });
            let merchantOrder;

            switch (topic) {
                case 'payment':
                    const paymentId = query.id || query['data.id'];
                    console.log("soy payment", paymentId);
                    const payment = this.paymentService.getPayment(paymentId as string);
                    // merchantOrder = this.paymentService.merchantOrder(payment.body.order.id);
                    break;
                case 'merchant_order':
                    const merchantOrderId = query.id;
                    merchantOrder = this.paymentService.merchantOrder(merchantOrderId as string);
                    break;
                default:
                    break;
            }

            res.status(200).send("OK");
        } catch (error) {
            const response = new BaseResponse({}, false, 'Error getting notification');
            res.status(500).json(response.toResponseEntity());
        }
    }
}