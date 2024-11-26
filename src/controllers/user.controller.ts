import { Request, Response } from 'express';
import { notificationService, userService } from '../services';
import { UserRequest } from '../dtos/request/userRequest';
import { BaseResponse } from '../dtos/base.response';
import { jwtPlugin } from '../public/jwt-plugin';
import { codeService } from '../services/code.service';
import { CodeType } from '@prisma/client';
import { tokenService } from '../services/token.service';

export const userController = {
    getById: async (req: Request, res: Response) => {
        try {
            const accessToken = req.app.locals.accessToken;
            const uuid = jwtPlugin.decode(accessToken).uuid;
            await tokenService.validateToken(accessToken, uuid);
            const currentUser = await userService.getById(uuid, 0);

            const user = await userService.getById(req.params.id, currentUser.user_id);
            const userResponse = userService.toUserResponse(user);

            const response = new BaseResponse({...userResponse, following: user.following}, true, 'User retrieved successfully');
            res.status(200).json(response.toResponseEntity());
        } catch (error: unknown) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const userRequest: UserRequest = req.body;
            const createdUser = await userService.create(userRequest);

            const {code, user} = await codeService.generateCode(createdUser.email, CodeType.VERIFY);
            await notificationService.sendMetaVerificationCode(user.phone, code.code);

            const token = await tokenService.createToken(user.uuid);
            const response = new BaseResponse({ token }, true, 'User created successfully. A WhatsApp verification code has been sent. Please use it to verify your account.');
            res.status(201).json(response.toResponseEntity());
        } catch (error: unknown) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const accessToken = req.app.locals.accessToken;
            const uuid = jwtPlugin.decode(accessToken).uuid;
            await tokenService.validateToken(accessToken, uuid);

            const userRequest = req.body

            const currentUser = await userService.getById(uuid);

            if (userRequest.email && userRequest.email !== currentUser.email) {
                const userByEmail = await userService.getUserByEmail(userRequest.email);
                if (userByEmail) {
                    throw new Error('The provided email is already in use by another account');
                }
            }

            if (userRequest.nickname && userRequest.nickname !== currentUser.nickname) {
                const userByNickname = await userService.getUserByNickname(userRequest.nickname);
                if (userByNickname) {
                    throw new Error('The provided nickname is already in use by another account');
                }
            }

            if (userRequest.password) {
                throw new Error('Password updates are not allowed through this endpoint. Please contact Hiram for further instructions.');
            }

                // Validate if trying to change restricted properties
                const restrictedProperties = ['phoneVerified', 'code', 'code_created_at', 'created_at', 'phone','uuid','id'];
                for (const prop of restrictedProperties) {
                    if (userRequest[prop] !== undefined) {
                        throw new Error(`Updates to the property '${prop}' are not allowed`);
                    }
                }

            const updatedUser = await userService.update(uuid, userRequest);
            const response = new BaseResponse(updatedUser, true, 'User updated successfully');
            res.status(200).json(response.toResponseEntity());

        } catch (error: unknown) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const accessToken = req.app.locals.accessToken;
            const uuid = jwtPlugin.decode(accessToken).uuid;
            await tokenService.validateToken(accessToken, uuid);

            const user = await userService.delete(uuid);

            const response = new BaseResponse({}, true, 'User deleted successfully');
            res.status(200).json(response.toResponseEntity());
        } catch (error: unknown) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const userResponse = await userService.login(email, password);

            const token = await tokenService.createToken(userResponse.uuid);
            const response = new BaseResponse({ token: token }, true, 'User logged in successfully. A verification code has been sent to your WhatsApp. Please use it to continue.');
            res.status(200).json(response.toResponseEntity());
        } catch (error: unknown) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    },
    updatePassword: async (req: Request, res: Response) => {
        try {
            const accessToken = req.app.locals.accessToken;
            const uuid = jwtPlugin.decode(accessToken).uuid;
            const token = await tokenService.validateToken(accessToken, uuid);
            const { password } = req.body;

            const user = await userService.getById(uuid);

            const response = await userService.updatePassword(user.email, password);
            res.status(200).json(response);
        } catch (error: unknown) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                return res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    },
    search: async (req: Request, res: Response) => {
        try {
            const accessToken = req.app.locals.accessToken;
            const uuid = jwtPlugin.decode(accessToken).uuid;
            await tokenService.validateToken(accessToken, uuid);
            
            const user = await userService.getById(uuid);

            const { text } = req.query;
            const users = await userService.search(text as string, user.user_id);

            const response = new BaseResponse(users, true, 'Users retrieved successfully');
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

};

