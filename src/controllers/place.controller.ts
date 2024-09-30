import { Request, Response } from "express";
import { PlaceService } from "../services/place.service";
import { BaseResponse } from "./base.response";

export class PlaceController {
    private placeServices: PlaceService;

    constructor(){
        this.placeServices = new PlaceService();
    }

    public async getPlaces(req: Request, res: Response) {
        try {
            const result = await this.placeServices.getAllPlaces();
            const response = new BaseResponse(result, true, 'Places found');
            res.status(200).json(response.toResponseEntity());
        } catch (error) {
            const response = new BaseResponse({}, false, 'Error getting places');
            res.status(500).json(response.toResponseEntity());
        }
    }

    public async getPlacesInOrder(req: Request, res: Response) {
        try {
            const { per_page=9, page=1 } = req.query
            const result = await this.placeServices.getPlacesByPage(parseInt(per_page as string), parseInt(page as string));
            const response = new BaseResponse(result, true, 'Places found');
            res.status(200).json(response.toResponseEntity());
        } catch (error) {
            const response = new BaseResponse({}, false, 'Error getting places per page');
            res.status(500).json(response.toResponseEntity());
        }
    }

    public async getPlaceByiD(req: Request, res: Response) {
        try {
            const { id_place } = req.params;
            const result = await this.placeServices.getPlaceById(parseInt(id_place));

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

    public async registerPlace(req: Request, res: Response) {
        try {
            const { name } = req.body;
            const result = await this.placeServices.registerPlace({ name: name});
            const response = new BaseResponse(result, true, 'Place created');
            res.status(201).json(response.toResponseEntity());
        } catch (error) {
            console.log(error);
            const response = new BaseResponse(error, false, 'Error creating place');
            res.status(500).json(response.toResponseEntity());
        }
    }

    public async deletePlace(req: Request, res: Response) {
        try {
            const { id_place } = req.params;
            const result = await this.placeServices.deletePlace(parseInt(id_place));
            const response = new BaseResponse(result, true, 'Place deleted');
            res.status(200).json(response.toResponseEntity());
        } catch (error) {
            const response = new BaseResponse({}, false, "Error deleting place");
            res.status(500).json(response.toResponseEntity());
        }
    }
}