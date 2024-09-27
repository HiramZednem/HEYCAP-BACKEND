import { MercadoPagoConfig, Payment, Preference} from 'mercadopago';
import { MP_ACCESS_TOKEN } from '../config';
import { v4 as uuidv4 } from 'uuid';

export class PaymentService {
    private client: MercadoPagoConfig;
    private preference: Preference;

    constructor(){
        this.client = new MercadoPagoConfig({accessToken: MP_ACCESS_TOKEN as string});
        this.preference = new Preference(this.client);
    }

    public async createProduct(name: string, quantity: number, price: number): Promise<string> {
        const id_product = uuidv4();
        
        return await this.preference.create({
            body: {
                back_urls: {
                    success: 'http://localhost:3000/api/mercadopago/success/',
                },
                items: [
                    {
                        id: id_product,
                        title: name,
                        quantity: quantity,
                        unit_price: price
                    }
                ],
            }
        }).then((response) => {
            console.log(response.sandbox_init_point);
            return response.sandbox_init_point as string;
        }).catch((error) => {
            console.log(error);
            throw new Error('Error creating product');
        });
    }
    
    // public async createProduct(name: string, quantity: number, price: number): Promise<string> {
    //     const id_product = uuidv4();
    //     try {
    //         const response = await this.preference.create({
    //             body: {
    //                 back_urls: {
    //                     success: 'http//localhost:3000/success',
    //                 },
    //                 items: [
    //                     {
    //                         id: id_product,
    //                         title: name,
    //                         quantity: quantity,
    //                         unit_price: price
    //                     }
    //                 ],
    //             }
    //         });
    //         console.log(response);
    //         return response.sandbox_init_point as string;
    //     } catch (error) {
    //         console.log(error);
    //         return "Error creating product";
    //     }
    // }
};