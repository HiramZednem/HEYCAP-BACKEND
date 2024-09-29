import { places, Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../db/db";

interface Place {
    place_id: number;
    uuid?: string;
    name?: string;
    dislikes?: [];
    likes?: [];
}

export class PlaceService {
    constructor(){}

    public async getAllPlaces(): Promise<Place[]> {
        return await prisma.places.findMany();
    }

    public async getPlaceById(id_place: number): Promise<Place | null> {
        return await prisma.places.findUnique({
            where: {
                place_id: id_place
            }
        });
    }

    public async registerPlace(data: Prisma.placesCreateInput): Promise<Place> {
        return await prisma.places.create({
            data: data
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