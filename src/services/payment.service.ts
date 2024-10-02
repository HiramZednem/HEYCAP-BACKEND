import { MercadoPagoConfig, Preference, MerchantOrder, Payment } from 'mercadopago';
import { MerchantOrderResponse } from 'mercadopago/dist/clients/merchantOrder/commonTypes';
import { MP_ACCESS_TOKEN } from '../config';
import { v4 as uuidv4 } from 'uuid';

export class PaymentService {
    private client: MercadoPagoConfig;
    private preference: Preference;
    private merchant_order: MerchantOrder;
    private payment: Payment;

    constructor() {
        this.client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN as string });
        this.preference = new Preference(this.client);
        this.merchant_order = new MerchantOrder(this.client);
        this.payment = new Payment(this.client);
    }

    public async createProduct(name: string, quantity: number, price: number): Promise<string> {
        const id_product = uuidv4();
        const url = "https://55de-189-150-47-37.ngrok-free.app/api/v1/mercadopago/";
        try {
            const createPreference = await this.preference.create({
                body: {
                    back_urls: {
                        success: url + 'success',
                    },
                    notification_url: url + 'notification',
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
                        name: 'Chanona',
                        surname: 'TEST',
                        email: 'test_user_1779072673@testuser.com',
                    },
                    payment_methods: {
                        default_payment_method_id: 'account_money',
                    },
                    purpose: 'wallet_purchase',
                    external_reference: 'ABC',
                }
            });
            // return createPreference.sandbox_init_point as string;
            return createPreference.init_point as string;
        } catch (error) {
            console.log(error);
            throw new Error('Error creating product');
        }
    }

    public async getPayment(paymentId: string) {
        try {
            const paymentFound = await this.payment.get({ id: paymentId });
            return paymentFound;
        } catch (error) {
            console.log(error);
            throw new Error('Error getting payment');

        }
    }

    public async merchantOrder(id_order: string): Promise<MerchantOrderResponse> {
        return await this.merchant_order.get({ merchantOrderId: id_order })
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