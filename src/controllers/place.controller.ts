import { Request, Response } from "express";
import { PlaceService } from "../services/place.service";
import { BaseResponse } from "../dtos/base.response";
import { jwtPlugin } from "../public";
import { tokenService } from "../services/token.service";
import { GoogleService } from "../services";

export class PlaceController {
    private placeServices: PlaceService;
    private googleServices: GoogleService;

    constructor(){
        this.placeServices = new PlaceService();
        this.googleServices = new GoogleService();
    }


    // public async getPlacesInOrder(req: Request, res: Response) {
    //     try {
    //         const { per_page=9, page=1 } = req.query
    //         const result = await this.placeServices.getPlacesByPage(parseInt(per_page as string), parseInt(page as string));
    //         const response = new BaseResponse(result, true, 'Places found');
    //         res.status(200).json(response.toResponseEntity());
    //     } catch (error) {
    //         const response = new BaseResponse({}, false, 'Error getting places per page');
    //         res.status(500).json(response.toResponseEntity());
    //     }
    // }

    public async getPlaceByiD(req: Request, res: Response) {
        try {
            const { id_place } = req.params;
            const result = await this.placeServices.getPlaceById(id_place);

            if(!result) {
                const response = new BaseResponse(result, true, 'No places added yet');
                return res.status(200).json(response.toResponseEntity());
            }
            const response = new BaseResponse(result, true, "Place Found");
            res.status(200).json(response.toResponseEntity());
        } catch (error) {
            const response = new BaseResponse({}, false, 'Error getting place');
            res.status(500).json(response.toResponseEntity());
        }
    }


    public async getNearbyPlaces(req: Request, res: Response) {
        try {
        // const accessToken = req.app.locals.accessToken;
        // const uuid = jwtPlugin.decode(accessToken).uuid;
        // await tokenService.validateToken(accessToken, uuid);

        const { lat, lng, next_page_token, type } = req.body;

        const results = await this.googleServices.getNearbyPlaces(lat, lng, next_page_token, type);

        if(results && results.places && results.places.length > 0) {

            const googleIds = results.places.map(place => place.google_id);

            const existingGoogleIds = await this.placeServices.filterExistingPlaces(googleIds);

            const newPlaces = results.places.filter(place => !existingGoogleIds.includes(place.google_id));

            if (newPlaces.length > 0) {
                this.placeServices.createPlaces(newPlaces);
            }
        }

        // TODO: De los places que me llegaron, voy a filtrar a los que el usuario les dio like o dislike

        const response = new BaseResponse(results, true, "Nearby places found");
        res.status(200).json(response.toResponseEntity());
         

        // De los places que me llegaron, voy a filtrar si el usuario les dio like o dislike y esos voy a regresar junto con el next page

        } catch {

        }
        
    }

    public async likePlace(req: Request, res: Response) {

    }

    public async dislikePlace(req: Request, res: Response) {
    }

}