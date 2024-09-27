import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
    constructor(){
    }

    public async create(req: Request, res: Response) {
        // const { name, quantity, price } = req.body;
        const name = 'Producto de prueba', quantity = 1, price = 100;
        const paymentService = new PaymentService();
        try {
            const result = await paymentService.createProduct(name, quantity, price);
            res.status(200).send(`<a href="${result}">Pagar</a>`);
        } catch (error) {
            res.status(500).json({
                message: 'Error creating product'
            });
        }
    }

    public success(req: Request, res: Response) {
        res.send('Pago exitoso');
    }
}