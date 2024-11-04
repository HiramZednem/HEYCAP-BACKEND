import { Request, Response } from "express";
import { InteractionService, tokenService, PlaceService, userService } from "../services";
import { BaseResponse } from "../dtos/base.response";
import { jwtPlugin } from "../public";

export class InteractiveController {
    private InteractionService: InteractionService;
    private placeService: PlaceService;

    constructor(){
        this.InteractionService = new InteractionService();
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


            const result = await this.InteractionService.likeMethod(user.user_id, Number(place.google_id));
            const response = new BaseResponse({}, true, "Like set");
            res.status(200).json(response.toResponseEntity());
        } catch (error: unknown) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async setDislike(req: Request, res: Response) {
        try {
            const accessToken = req.app.locals.accessToken;
            const uuid = jwtPlugin.decode(accessToken).uuid;
            await tokenService.validateToken(accessToken, uuid);

            const user = await userService.getById(uuid);
            const place = await this.placeService.getPlaceById(req.params.id_place);


            const result = await this.InteractionService.dislikeMethod(user.user_id, Number( place!.google_id));
            const response = new BaseResponse({}, true, "Dislike set");
            res.status(200).json(response.toResponseEntity());
        } catch (error: unknown) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getInterractionsByPlace(req: Request, res: Response) {
        try {
            const { place_id } = req.params;
            const place = await this.placeService.getPlaceById(place_id);

            const interactions = await this.InteractionService.getInteractionsByPlaceId(Number(place!.google_id));
            const response = new BaseResponse(interactions, true, "User interactions retrieved");
            res.status(200).json(response.toResponseEntity());
        } catch(error: unknown) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getInterractionsByUser(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
            const user = await userService.getById(user_id);

            const interactions = await this.InteractionService.getInteractionsByUserId(user.user_id);
            const response = new BaseResponse(interactions, true, "User interactions retrieved");
            res.status(200).json(response.toResponseEntity());

        } catch(error: unknown) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }

    }
}