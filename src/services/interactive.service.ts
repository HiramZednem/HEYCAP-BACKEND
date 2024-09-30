import { dislikes, likes } from "@prisma/client";
import { prisma } from "../db/db";

export class InteractiveService {

    constructor(){}

    public async likeMethod(user_id: number, place_id: number): Promise<likes> {
        try {
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
        } catch (error) {
            console.error(error);
            throw new Error("Error creating like");
        }
    }

    public async dislikeMethod(user_id: number, place_id: number): Promise<dislikes> {
        try {
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
        } catch (error) {
            console.error(error);
            throw new Error("Error creating like");
        }
    }
}