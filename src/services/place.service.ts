import { Prisma, places } from "@prisma/client";
import { prisma } from "../db/db";
import { PlaceResponse } from "../dtos/place.interface";


export class PlaceService {
    constructor() { }


    public async filterExistingPlaces(googleIds: string[]): Promise<string[]> {
        const existingPlaces = await prisma.places.findMany({
            where: {
                google_id: {
                    in: googleIds,
                },
            },
            select: {
                google_id: true, 
            },
        });
        return existingPlaces.map(place => place.google_id);  // Devuelve un array con los google_id existentes
    }

    public async createPlaces(places: PlaceResponse[]): Promise<Prisma.BatchPayload> {
        const createdPlaces = await prisma.places.createMany({
            data: places.map(place => ({
                google_id: place.google_id,
                name: place.name,
                photos: place.photos,
                rating: place.rating,
                vicinity: place.vicinity,
                lat: place.lat,
                lng: place.lng,
            })),
            skipDuplicates: true, // Omite duplicados en caso de que existan
        });
            return createdPlaces;
        }
    
    public async getPlaceById(google_id: string): Promise<places | null> {
        try {
            const place = await prisma.places.findUnique({
                where: {
                    google_id: google_id
                }
            });
            return place;
        } catch (error) {
            console.error(error);
            throw new Error("Error getting place by id");
        }
    }

}