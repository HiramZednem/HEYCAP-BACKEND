import { MercadoPagoConfig, Preference, MerchantOrder, Payment} from 'mercadopago';
import { MerchantOrderResponse } from 'mercadopago/dist/clients/merchantOrder/commonTypes';
import { MP_ACCESS_TOKEN } from '../config';
import { v4 as uuidv4 } from 'uuid';

export class PaymentService {
    private client: MercadoPagoConfig;
    private preference: Preference;
    private merchant_order: MerchantOrder;
    private payment: Payment;

    constructor(){
        this.client = new MercadoPagoConfig({accessToken: MP_ACCESS_TOKEN as string});
        this.preference = new Preference(this.client);
        this.merchant_order = new MerchantOrder(this.client);
        this.payment = new Payment(this.client);
    }

    private getHeader(): { "Content-Yype": string, "Authorization": string } {
        return {
            "Content-Yype": "application/json",
            "Authorization": `Bearer ${MP_ACCESS_TOKEN}`
        }
    }

    public async createProduct(name: string, quantity: number, price: number): Promise<string> {
        const id_product = uuidv4();

        return await this.preference.create({
            body: {
                back_urls: {
                    success: 'https://4e07-2806-2f0-8180-8a7-302f-23c7-bc78-9959.ngrok-free.app/api/v1/mercadopago/success',
                },
                notification_url: 'https://4e07-2806-2f0-8180-8a7-302f-23c7-bc78-9959.ngrok-free.app/api/v1/mercadopago/notification',
                auto_return: 'approved',
                items: [
                    {
                        id: id_product,
                        title: name,
                        quantity: quantity,
                        unit_price: price,
                        currency_id: 'MXN',
                    }
                ],
                payer: {
                    name: 'Lalo',
                    surname: 'Landa',
                    email: 'cocacola',
                },
                payment_methods: {
                    default_payment_method_id: 'master',
                },
            }
        }).then((response) => {
            console.log(response.sandbox_init_point);
            return response.sandbox_init_point as string;
        }).catch((error) => {
            console.log(error);
            throw new Error('Error creating product');
        });
    }
    
    public async getPayment(paymentId: string) {
        return await this.payment.get({ id: paymentId})
        .then((response) => {
            console.log("RESPUESTA PAPU")
            console.log(response);
            return response.id;
        }).catch((error) => {
            console.log(error);
            throw new Error('Error getting payment');
        });
    }

    public async merchantOrder(id_order: string): Promise<MerchantOrderResponse> {
        return await this.merchant_order.get({ merchantOrderId: id_order})
        .then((response) => {
            console.log(response);
            return response;
        })
        .catch((error) => {
            console.log(error);
            throw new Error('Error getting merchant order');
        });
    }
    
};