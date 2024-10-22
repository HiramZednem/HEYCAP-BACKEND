import { Request, Response } from "express";
import { InteractiveService } from "../services/interactive.service";
import { BaseResponse } from "../dtos/base.response";
import { jwtPlugin } from "../public";
import { tokenService } from "../services/token.service";
import { userService } from "../services";
import { PlaceService } from "../services/place.service";

export class InteractiveController {
    private interactiveService: InteractiveService;
    private placeService: PlaceService;

    constructor(){
        this.interactiveService = new InteractiveService();
        this.placeService = new PlaceService();
    }

    public async setLike(req: Request, res: Response) {
        try {
            const accessToken = req.app.locals.accessToken;
            const uuid = jwtPlugin.decode(accessToken).uuid;
            await tokenService.validateToken(accessToken, uuid);

            const user = await userService.getById(uuid);
            const place = await this.placeService.getPlaceById(req.params.id_place);

            if (!user) {
                throw new Error("User not found");
            }
            if (!place) {
                throw new Error("Place not found");
            }


            const result = this.interactiveService.likeMethod(user.user_id, place.place_id);
            const response = new BaseResponse(result, true, "Like set");
            res.status(200).json(response.toResponseEntity());
        } catch (error) {
            const response = new BaseResponse({}, false, "Error setting like");
            res.status(500).json(response.toResponseEntity());
        }
    }

    public async setDislike(req: Request, res: Response) {
        try {
            const { user_id, place_id } = req.body;
            const result = this.interactiveService.dislikeMethod(parseInt(user_id as string), parseInt(place_id as string));
            const response = new BaseResponse(result, true, "Dislike set");
            res.status(200).json(response.toResponseEntity());
        } catch (error) {
            const response = new BaseResponse({}, false, "Error setting dislike");
            res.status(500).json(response.toResponseEntity());
        }
    }
}