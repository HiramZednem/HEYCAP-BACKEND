import { Prisma, places } from "@prisma/client";
import { prisma } from "../db/db";

interface Place {
    place_id: number;
    uuid?: string;
    name?: string;
}

export class PlaceService {
    constructor(){}

    public async getAllPlaces(): Promise<places[]> {
        return await prisma.places.findMany({
            include: {
                dislikes: true,
                likes: true
            }
        });
    }

    public async getPlaceById(id_place: number): Promise<places | null> {
        try {
            const place = await prisma.places.findUnique({
                where: {
                    place_id: id_place
                },
                include: {
                    dislikes: true,
                    likes: true
                }
            });
            return place;
        } catch (error) {
            console.error(error);
            throw new Error("Error getting place by id");
            
        }
    }

    public async registerPlace(data: Prisma.placesCreateInput): Promise<Place> {
        return await prisma.places.create({
            data: {
                name: data.name,
            }

        });
    }

    public async deletePlace(id_place: number): Promise<Place | null> {
        return await prisma.places.delete({
            where: {
                place_id: id_place
            }
        });
    }
}