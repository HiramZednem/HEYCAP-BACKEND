import { Prisma, places } from "@prisma/client";
import { prisma } from "../db/db";
import { PlaceResponse } from "../dtos/place.interface";

interface Place {
    place_id: number;
    uuid?: string;
    name?: string;
}

type PlacesResponse = {
    data: places[];
    current_page: number;
    per_page: number;
    total_places: number;
    total_pages: number;
};

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

    // public async getPlacesByPage(per_page: number, page: number): Promise<PlacesResponse | null> {
    //     const validPage = Math.max(page, 1); // This is to avoid negative pages and make sure that the page is greater than 0
    //     const validPerPage = Math.max(per_page, 1);
    //     try {
    //         const total_places = await prisma.places.count();
    //         if (total_places === 0) {
    //             return null;
    //         }
    //         const places = await prisma.places.findMany({
    //             skip: (validPage - 1) * validPerPage,
    //             take: validPerPage,
    //             include: {
    //                 likes: true,
    //                 dislikes: true
    //             }
    //         });
    //         return {
    //             data: places,
    //             current_page: validPage,
    //             per_page: validPerPage,
    //             total_places: total_places,
    //             total_pages: Math.ceil(total_places / validPerPage) // this is to calculate the total number of pages and round it up to the nearest whole number
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         throw new Error("Error getting place by id");

    //     }
    // }

    // // public async registerPlace(data: Prisma.placesCreateInput): Promise<Place> {
    // //     return await prisma.places.create({
    // //         data: {
    // //             name: data.name,
    // //         }

    // //     });
    // // }

    // public async deletePlace(id_place: number): Promise<Place | null> {
    //     return await prisma.places.delete({
    //         where: {
    //             place_id: id_place
    //         }
    //     });
    // }

    public async createPlace(placeRespone: PlaceResponse): Promise<Place | null> {
        return prisma.places.create({
            data: {
                name: placeRespone.name,
                google_id: placeRespone.google_id,
                lat: placeRespone.lat,
                lng: placeRespone.lng,
                rating: placeRespone.rating,
                vicinity: placeRespone.vicinity,
                photos: placeRespone.photos
            }
        });
    }
}