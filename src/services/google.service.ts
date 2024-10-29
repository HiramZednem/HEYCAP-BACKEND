import { GOOGLE_KEY } from '../config';
import axios from 'axios';
import { DataGoogle, Place, PlaceResponse } from '../dtos/place.interface';
import { userService } from './user.service';
import { InteractionService } from './interaction.service';
import { PlaceService } from './place.service';


const radius = 5000;  // Radius in meters (5,000 meters = 5 km)


export class GoogleService {
    private interactionService: InteractionService;
    private placeServices: PlaceService;

    constructor() { 
        this.interactionService = new InteractionService();
        this.placeServices = new PlaceService();
    }

    public async getNearbyPlaces(lat: string, lng: string, next_page_token: string = '', type: string = '', user_uuid: string) {
        const location = `${lat},${lng}`;
        let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&pagetoken=${next_page_token}&key=${GOOGLE_KEY}`;

        try {
            const response = await axios.get(url);
    
            const places: DataGoogle = response.data;

            


            // if (places.results.length === 0 && !places.next_page_token) {
            //     throw new Error("No new nearby places found that you haven't interacted with.");
            // }
            

            // TODO: De los places que me llegaron, voy a filtrar a los que el usuario les dio like o dislike
            const user = await userService.getById(user_uuid);
            const userInteractions = await this.interactionService.getInteractionsByUserId(user.user_id);

            let placesVisitedByUser = [
                ...userInteractions.likes.map(like => like.place.google_id),
                ...userInteractions.dislikes.map(dislike => dislike.place.google_id)
            ];

            places.results = places.results.filter(place => !placesVisitedByUser.includes(place.place_id));


            let responseP: PlaceResponse[] = [];

            places.results.forEach((place: Place) => {
                const placeResponse = this.to(place);
                responseP.push(placeResponse);
            });


            if(places && places.results && places.results.length > 0) {

                const googleIds = places.results.map(place => place.place_id);
    
                const existingGoogleIds = await this.placeServices.filterExistingPlaces(googleIds);
    
                const newPlaces = places.results.filter(place => !existingGoogleIds.includes(place.place_id));
    
                if (newPlaces.length > 0) {
                    await this.placeServices.createPlaces(newPlaces.map(place => this.to(place)));
                }
            }

            return { places: responseP, next_page_token: places.next_page_token };
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    }
    
    private to(place: Place): PlaceResponse {
        return {
            google_id: place.place_id,
            name: place.name,
            photos: [(place?.photos && place.photos.length > 0) ? this.getPhotoUrl(place.photos[0].photo_reference) : ''],
            rating: place?.rating ? place.rating : 0,
            vicinity: place.vicinity,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
        };
    }

    private getPhotoUrl(photo_reference: string, maxWidth: number = 400): string {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photo_reference}&key=${GOOGLE_KEY}`;
    }
}

