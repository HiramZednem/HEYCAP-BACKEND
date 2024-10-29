import { Request, Response } from "express";
import { PlaceService } from "../services/place.service";
import { BaseResponse } from "../dtos/base.response";
import { jwtPlugin } from "../public";
import { tokenService } from "../services/token.service";
import { GoogleService, InteractionService, userService } from "../services";

export class PlaceController {
    private placeServices: PlaceService;
    private googleServices: GoogleService;
    private InteractionService: InteractionService;

    constructor(){
        this.placeServices = new PlaceService();
        this.googleServices = new GoogleService();
        this.InteractionService = new InteractionService();
    }


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
        const accessToken = req.app.locals.accessToken;
        const uuid = jwtPlugin.decode(accessToken).uuid;
        await tokenService.validateToken(accessToken, uuid);

        const { lat, lng, next_page_token, type } = req.body;

        const results = await this.googleServices.getNearbyPlaces(lat, lng, next_page_token, type, uuid);

        

        

        const response = new BaseResponse(results, true, "Nearby places found");
        res.status(200).json(response.toResponseEntity());

        } catch(error: unknown) {
            if (error instanceof Error) {
                console.error(error);
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
        
    }

}