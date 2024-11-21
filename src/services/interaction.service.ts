import { dislikes, likes } from "@prisma/client";
import { prisma } from "../db/db";

export class InteractionService {

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
            }
        });

        return commentResult;
    }
}