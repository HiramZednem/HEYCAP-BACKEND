import { GOOGLE_KEY } from '../config';
import axios from 'axios';
import { DataGoogle, Place, PlaceResponse } from '../dtos/place.interface';


const radius = 5000;  // Radius in meters (5,000 meters = 5 km)


export class GoogleService {
    constructor() { }

    public async getNearbyPlaces(lat: string, lng: string, next_page_token: string = '') {
        const location = `${lat},${lng}`;
        let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&pagetoken=${next_page_token}&key=${GOOGLE_KEY}`;

        try {
            const response = await axios.get(url);
    
            const places: DataGoogle = response.data;
          
            let responseP: PlaceResponse[] = [];
            places.results.forEach((place: Place) => {
                const placeResponse = this.to(place);
                responseP.push(placeResponse);
            });

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

