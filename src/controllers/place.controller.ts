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

    // public async getPlaces(req: Request, res: Response) {
    //     try {
    //         const result = await this.placeServices.getAllPlaces();
    //         const response = new BaseResponse(result, true, 'Places found');
    //         res.status(200).json(response.toResponseEntity());
    //     } catch (error) {
    //         const response = new BaseResponse({}, false, 'Error getting places');
    //         res.status(500).json(response.toResponseEntity());
    //     }
    // }

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

    // public async getPlaceByiD(req: Request, res: Response) {
    //     try {
    //         const { id_place } = req.params;
    //         const result = await this.placeServices.getPlaceById(parseInt(id_place));

    //         if(!result) {
    //             const response = new BaseResponse(result, true, 'No places added yet');
    //             return res.status(200).json(response.toResponseEntity());
    //         }
    //         const response = new BaseResponse(result, true, "Place Found");
    //         res.status(200).json(response.toResponseEntity());
    //     } catch (error) {
    //         const response = new BaseResponse({}, false, 'Error getting place');
    //         res.status(500).json(response.toResponseEntity());
    //     }
    // }

    // public async registerPlace(req: Request, res: Response) {
    //     try {
    //         const { name } = req.body;
    //         // const result = await this.placeServices.registerPlace({ name: name});
    //         // const response = new BaseResponse(result, true, 'Place created');
    //         // res.status(201).json(response.toResponseEntity());
    //     } catch (error) {
    //         console.log(error);
    //         const response = new BaseResponse(error, false, 'Error creating place');
    //         res.status(500).json(response.toResponseEntity());
    //     }
    // }

    // public async deletePlace(req: Request, res: Response) {
    //     try {
    //         const { id_place } = req.params;
    //         const result = await this.placeServices.deletePlace(parseInt(id_place));
    //         const response = new BaseResponse(result, true, 'Place deleted');
    //         res.status(200).json(response.toResponseEntity());
    //     } catch (error) {
    //         const response = new BaseResponse({}, false, "Error deleting place");
    //         res.status(500).json(response.toResponseEntity());
    //     }
    // }

    // // by id
    // public async get(req: Request, res: Response) {
    //     try {
    //         const { id_place } = req.params;
    //         const result = await this.placeServices.getPlaceById(parseInt(id_place));

    //         if(!result) {
    //             const response = new BaseResponse(result, true, 'No places added yet');
    //             return res.status(200).json(response.toResponseEntity());
    //         }
    //         const response = new BaseResponse(result, true, "Place Found");
    //         res.status(200).json(response.toResponseEntity());
    //     } catch (error) {
    //         const response = new BaseResponse({}, false, 'Error getting place');
    //         res.status(500).json(response.toResponseEntity());
    //     }

    // }

    public async getNearbyPlaces(req: Request, res: Response) {
        try {
        // const accessToken = req.app.locals.accessToken;
        // const uuid = jwtPlugin.decode(accessToken).uuid;
        // await tokenService.validateToken(accessToken, uuid);

        const { lat, lng, next_page_token } = req.body;

        const places = await this.googleServices.getNearbyPlaces(lat, lng, next_page_token);
        
        const response = new BaseResponse(places, true, "Nearby places found");
        res.status(200).json(response.toResponseEntity());
        // recibo mis places
        // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&pagetoken=${next_page_token}&key=${apiKey}`;
        // de los places que me llegaron los voy a filtrar si existen en mi bd por el google_id
        // si existe next, si no existe lo guardo en mi bd

        // De los places que me llegaron, voy a filtrar si el usuario les dio like o dislike y esos voy a regresar junto con el next page

        } catch {

        }
        
    }

    public async likePlace(req: Request, res: Response) {
    }

    public async dislikePlace(req: Request, res: Response) {
    }

}