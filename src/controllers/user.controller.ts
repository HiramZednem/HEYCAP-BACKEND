import { Request, Response } from 'express';
import { notificationService, userService } from '../services';
import { UserRequest } from './dtos/request/userRequest';
import { BaseResponse } from './dtos/base.response';
import { jwtPlugin } from '../public/jwt-plugin';

export const userController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const users = await userService.getAll();
            const response = new BaseResponse(users, true, 'Successfully retrieved all users');
            res.status(200).json(response.toResponseEntity());
        } catch (e) {
            const response = new BaseResponse({}, false, 'Error retrieving users');
            res.status(500).json(response.toResponseEntity());
        }
    },
    getById: async (req: Request, res: Response) => {
        try {
            const user = await userService.getById(req.params.id);
            const response = new BaseResponse(user, true, 'User retrieved successfully');
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
            const user = await userService.create(userRequest);

            const verificationCode = await notificationService.sendMetaVerificationCode(user.phone);
            await userService.update(user.uuid, { code: verificationCode, code_created_at: new Date() });

            const token = jwtPlugin.sign({uuid: user.uuid});
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
            const userId = req.params.id;
            const userRequest = req.body

            const currentUser = await userService.getById(userId);

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

            const updatedUser = await userService.update(userId, userRequest);
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
            const user = await userService.delete(req.params.id);

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
            
            const response = new BaseResponse({ token: jwtPlugin.sign({uuid: userResponse.uuid}) }, true, 'User logged in successfully. A verification code has been sent to your email. Please use it to continue.');
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

