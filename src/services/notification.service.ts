import { META_KEY, META_URL } from '../config';
import { prisma } from '../db/db';
import axios from 'axios';


export const notificationService = {
    sendMetaVerificationCode: async (phone: any) => {
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        const response = await axios.post(
            META_URL!,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: `+52${phone}`,
                type: "template",
                template: {
                    name: "authentication",
                    language: {
                        code: "en_US"
                    },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                {
                                    type: "text",
                                    text: verificationCode
                                }
                            ]
                        },
                        {
                            type: "button",
                            sub_type: "url",
                            index: "0",
                            parameters: [
                                {
                                    type: "text",
                                    text: verificationCode
                                }
                            ]
                        }
                    ]
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${META_KEY}`  // Token de acceso de Meta
                }
            }
        );
        return verificationCode;
    
    },
};