import { Request, Response } from "express";
import { InteractiveService } from "../services/interactive.service";
import { BaseResponse } from "./base.response";

export class InteractiveController {
    private interactiveService: InteractiveService;

    constructor(){
        this.interactiveService = new InteractiveService();
    }

    public async setLike(req: Request, res: Response) {
        try {
            const { user_id, place_id } = req.body;
            const result = this.interactiveService.likeMethod(parseInt(user_id as string), parseInt(place_id as string));
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