import { Prisma, places } from "@prisma/client";
import { prisma } from "../db/db";
import { PlaceDetailResponse, PlaceDetails, PlaceResponse } from "../dtos/place.interface";
import { GOOGLE_KEY } from "../config";
import axios from "axios";

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
                types: place.types,
                cost: place.cost,
            })),
            skipDuplicates: true, // Omite duplicados en caso de que existan
        });
            return createdPlaces;
        }
    
    public async getPlaceById(google_id: string) {
        try {
            const place = await prisma.places.findUnique({
                where: {
                    google_id: google_id
                }
            });

            if (!place) {
                throw new Error("Place not found");
            }

            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.google_id}&key=${GOOGLE_KEY}`;
            const response = await axios.get(url);
            const placeDetails: PlaceDetails = response.data.result;

            return this.to(placeDetails);
        } catch (error) {
            console.error(error);
            throw new Error("Error getting place by id");
        }
    }

    private to(place: PlaceDetails): PlaceDetailResponse {
        return {
            google_id: place.place_id,
            name: place.name,
            photos: place?.photos ? place.photos.map(photo => this.getPhotoUrl(photo.photo_reference)) : [],
            rating: place?.rating ? place.rating : 0,
            vicinity: place.vicinity,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            types: place.types,
            cost: place.price_level ? place.price_level.toString() : '0'
        };
    }

    private getPhotoUrl(photo_reference: string, maxWidth: number = 400): string {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photo_reference}&key=${GOOGLE_KEY}`;
    }

    public async getIdByGoogleId(google_id: string): Promise<number> {
        const place = await prisma.places.findUnique({
            where: {
                google_id: google_id
            }
        });

        if (!place) {
            throw new Error("Place not found");
        }

        return place.place_id;
    }
}