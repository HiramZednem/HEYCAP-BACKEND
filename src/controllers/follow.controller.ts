import { Request, Response } from "express";
import { BaseResponse } from "../dtos/base.response";
import { followService, tokenService, userService } from "../services";
import { jwtPlugin } from "../public";


export class FollowController {

    private followService: followService;

    constructor(){
        this.followService = new followService();
    }

    public async follow(req: Request, res: Response) {
        try {
            const accessToken = req.app.locals.accessToken;
            const uuid = jwtPlugin.decode(accessToken).uuid;
            await tokenService.validateToken(accessToken, uuid);

            const { id_followed } = req.params;

            const user = await userService.getUserByIdFullUser(uuid);
            const followed = await userService.getUserByIdFullUser(id_followed);


            if (user.uuid === followed.uuid) {
                throw new Error("You cannot follow yourself")
            }

            const follow = await this.followService.follow(user.user_id, followed.user_id);

            const response = new BaseResponse(follow, true, "follow added");
            res.status(200).json(response.toResponseEntity());


        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async unfollow(req: Request, res: Response) {
        try {
            const accessToken = req.app.locals.accessToken;
            const uuid = jwtPlugin.decode(accessToken).uuid;
            await tokenService.validateToken(accessToken, uuid);

            const { id_followed } = req.params;

            const user = await userService.getUserByIdFullUser(uuid);
            const followed = await userService.getUserByIdFullUser(id_followed);


            if (user.uuid === followed.uuid) {
                throw new Error("You cannot unfollow yourself")
            }

            const unfollow = await this.followService.unfollow(user.user_id, followed.user_id);
            const response = new BaseResponse(unfollow, true, "follow deleted");
            res.status(200).json(response.toResponseEntity());
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getFollowers(req: Request, res: Response) {
        try {
            const { id_user } = req.params;
            const user = await userService.getUserByIdFullUser(id_user)

            const followers = await this.followService.getFollowers(user.user_id);
            res.status(200).json({followers});
        } catch (error: unknown) {
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