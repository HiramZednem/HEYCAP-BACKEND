import { dislikes, likes } from "@prisma/client";
import { prisma } from "../db/db";
import { GOOGLE_AUTH_URI, GOOGLE_CERT_URL, GOOGLE_CLIENT_CERT_URL, GOOGLE_CLIENT_EMAIL, GOOGLE_CLIENT_ID, GOOGLE_KEY, GOOGLE_PRIVATE_KEY, GOOGLE_PRIVATE_KEY_ID, GOOGLE_PROJECT_ID, GOOGLE_TOKEN_URI } from "../config";
import axios from "axios";
import { GoogleAuth } from "google-auth-library";

export class InteractionService {


    private API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

    constructor(){}

    public async likeMethod(user_id: number, place_id: number): Promise<likes> {
        if (await this.hasUserLikedPlace(user_id, place_id)) {
            throw new Error('User has already liked this place');
        }

        this.createView(user_id, place_id);

        if (await this.hasUserDislikedPlace(user_id, place_id)) {
            await prisma.dislikes.delete({
                where: { 
                    user_id_place_id: {
                        place_id: place_id,
                        user_id: user_id
                    }
                    }
            })
        }


        const like = await prisma.likes.create({
            data: {
                place: {
                    connect: {
                        place_id: place_id
                    }
                },
                user: {
                    connect: {
                        user_id: user_id
                    }
                }
            },
        });
        return like;
        
    }

    public async dislikeMethod(user_id: number, place_id: number): Promise<dislikes> {
        if (await this.hasUserDislikedPlace(user_id, place_id)) {
            throw new Error('User has already disliked this place');
        }

        this.createView(user_id, place_id);

        if (await this.hasUserLikedPlace(user_id, place_id)) {
            await prisma.likes.delete({
                where: { 
                    user_id_place_id: {
                        place_id: place_id,
                        user_id: user_id
                    }
                    }
            });
        }

        const like = await prisma.dislikes.create({
            data: {
                place: {
                    connect: {
                        place_id: place_id
                    }
                },
                user: {
                    connect: {
                        user_id: user_id
                    }
                }
            },
        });
        return like;
    }

    public async getInteractionsByUserId(userId: number) {
        const likes =  await prisma.likes.findMany({
          where: { user_id: userId },
          select: {
            place: {
                select: {
                    google_id: true,
                    name: true,
                    photos : true,
                    rating: true,
                    vicinity: true,
                    lat: true,
                    lng: true,
                }
            }
          }
        });

        const dislikes = await prisma.dislikes.findMany({
            where: { user_id: userId },
            select: {
                place: {
                    select: {
                        google_id: true,
                        name: true,
                        photos : true,
                        rating: true,
                        vicinity: true,
                        lat: true,
                        lng: true,
                    }
                }
            }
        });

        return { likes, dislikes };
    }

    public async getInteractionsByPlaceId(placeId: number) {
        const likes =  await prisma.likes.findMany({
          where: { place_id: placeId },
          select: {
            user: {
                select: {
                    nickname: true,
                    avatar: true,
                }
            }
          }});

        const dislikes = await prisma.dislikes.findMany({
            where: { place_id: placeId },
            select: {
                user: {
                    select: {
                        nickname: true,
                        avatar: true,
                    }
                }
            }
        });

        return { likes, dislikes };
            
    }
    

    private async hasUserLikedPlace(user_id: number, place_id: number) {
        const existingLike = await prisma.likes.findFirst({
            where: {
                user_id: user_id,
                place_id: place_id,
            },
        });
    
        if (existingLike) {
            // El usuario ya le dio like al lugar
            return true;
        } else {
            // El usuario no le ha dado like al lugar
            return false;
        }
    }

    private async hasUserDislikedPlace(user_id: number, place_id: number) {
        const existingDislike = await prisma.dislikes.findFirst({
            where: {
                user_id: user_id,
                place_id: place_id,
            },
        });
    
        if (existingDislike) {
            return true;
        } else {
            return false;
        }
    }

    private async createView(user_id: number, place_id: number) {
        const existingView = await prisma.views.findFirst({
            where: {
            user_id: user_id,
            place_id: place_id,
            },
        });

        if (existingView) {
            return existingView;
        }

        const view = await prisma.views.create({
            data: {
            place: {
                connect: {
                place_id: place_id
                }
            },
            user: {
                connect: {
                user_id: user_id
                }
            }
            },
        });
        return view;
    }

    public async createComment(user_id: number, place_id: number, comment: string) {
        const polaridad = await this.obtenerPolaridad(comment);
        const commentResult = await prisma.comments.create({
            data: {
                user: {
                    connect: {
                        user_id: user_id
                    }
                },
                place: {
                    connect: {
                        place_id: place_id
                    }
                },
                comment: comment,
                stars: polaridad
            }
        });

        return commentResult;
    }

    private async getAccessToken() {
        const SCOPES = ['https://www.googleapis.com/auth/generative-language'];

        const auth = new GoogleAuth({
            credentials: {
                type: 'service_account',
                project_id: GOOGLE_PROJECT_ID,
                private_key_id: GOOGLE_PRIVATE_KEY_ID,
                private_key: GOOGLE_PRIVATE_KEY,
                client_email: GOOGLE_CLIENT_EMAIL,
                client_id: GOOGLE_CLIENT_ID,
            },
            
            scopes: SCOPES
        });
    
        const client = await auth.getClient();
        console.log('Client:', client);
        const accessToken = await client.getAccessToken();
        console.log('Access Token:', accessToken.token);
        return accessToken.token;
    }

    public async obtenerPolaridad(mensaje: string) {
        try {
            const token = await this.getAccessToken();
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            const prompt = `
            Analiza este texto: "${mensaje}".
            Devuelve únicamente numero con este formato para evaluar la polaridad:
            <un valor entero entre 1 y 5>
            No des explicaciones ni incluyas texto adicional.`;


            const payload = {
                contents: [
                    { parts: [{ text: prompt }] }
                ]
            };
    
            const response = await axios.post(this.API_ENDPOINT, payload, { headers });
            if (response.status === 200) {
                const data = response.data;
                try {
                    const response = data.candidates[0].content.parts[0].text.trim()

                    const polaridad = Number(response);
                    if (isNaN(polaridad)) {
                        return 0;
                    }
                    return polaridad;
                } catch (error) {
                    return 0;
                }
            } else {
                console.error('Error:', response.status, response.data);
                return 0;
            }
        } catch (error: any) {
            console.error('Error al enviar el mensaje:', error.message);
            return 0;
        }
    }
    
}