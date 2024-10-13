import { Request, Response } from 'express';
import { notificationService, userService } from '../services';
import bcrypt from 'bcrypt';
import { BaseResponse } from './dtos/base.response';
import { JWT_KEY } from '../config';
import jwt from 'jsonwebtoken';

export const notificationController = {
    verifyNumberPost: async (req: Request, res: Response) => {
        try {
            const user = await userService.getUserByEmail(req.body.email);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (user?.phone === undefined) {
                return res.status(404).json({ error: 'Add a phone number first' });
            }

            if (user?.phoneVerified) {
                return res.status(400).json({ error: 'Phone already verified' });
            }

            const verificationCode = await notificationService.sendMetaVerificationCode(user.phone);
            await userService.update(user.uuid, { code: verificationCode, code_created_at: new Date() });

            const response = new BaseResponse({}, true, 'Message sent');
            res.status(200).json(response.toResponseEntity())
        } catch (error) {
            const response = new BaseResponse({}, false, 'Error sending message');
            res.status(500).json(response.toResponseEntity());
        }
    },
    verifyNumberGet: async (req: Request, res: Response) => {
        const user = await userService.getUserByEmail(req.body.email);

        if (user?.phoneVerified) {
            return res.status(400).json({ error: 'Phone already verified' });
        }

        if (user?.code === undefined) {
            return res.status(400).json({ error: 'No se ha iniciado el proceso de verificación' });
        }

        if (user.code == req.params.code) {
            await userService.update(user!.uuid, { code: null, code_created_at: new Date(), phoneVerified: true });

            const userResponse = await userService.getById(user.uuid);

            const token = jwt.sign({ user }, JWT_KEY as string, { expiresIn: "12h" });
            const response = new BaseResponse({ user:userResponse, token }, true, 'Number verified');
            res.status(200).json(response.toResponseEntity())
        } else {
            const response = new BaseResponse({}, false, 'Error verifying number');
            res.status(400).json(response.toResponseEntity())
        }
    },
    authLoginGet: async (req: Request, res: Response) => {
        try {
            const user = await userService.getUserByEmail(req.body.email);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (user.code == req.params.code) {
                await userService.update(user!.uuid, { code: null, code_created_at: new Date(), phoneVerified: true });
                const userResponse = await userService.getById(user.uuid);
                const token = jwt.sign({ user }, JWT_KEY as string, { expiresIn: "12h" });
                const response = new BaseResponse({ user:userResponse, token }, true, 'Login success');
                res.status(201).json(response.toResponseEntity())
            } else {
                const response = new BaseResponse({}, false, 'Error verifyng number');
                res.status(400).json(response.toResponseEntity())
            }
        } catch (error) {
            const response = new BaseResponse({}, false, 'Error sending message');
            res.status(500).json(response.toResponseEntity());
        }
    },
    authLoginPost: async (req: Request, res: Response) => {
        try {
            const user = await userService.getUserByEmail(req.body.email);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (user?.phone === undefined) {
                return res.status(404).json({ error: 'Add a phone number first' });
            }

            const verificationCode = await notificationService.sendMetaVerificationCode(user.phone);
            await userService.update(user.uuid, { code: verificationCode, code_created_at: new Date() });

            const response = new BaseResponse({}, true, 'Message sent');
            res.status(200).json(response.toResponseEntity())
        } catch (error) {
            const response = new BaseResponse({}, false, 'Error sending message');
            res.status(500).json(response.toResponseEntity());
        }
    },
    forgotPassword: async (req: Request, res: Response) => {
        try {
            const user = await userService.getUserByEmail(req.body.email);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (user?.phone === undefined) {
                return res.status(404).json({ error: 'You do not have a phone number in your account, reach us by support service' });
            }

            const verificationCode = await notificationService.sendMetaVerificationCode(user.phone);
            await userService.update(user.uuid, { code: verificationCode, code_created_at: new Date() });
            const response = new BaseResponse({}, true, 'Message sent');
            res.status(200).json(response.toResponseEntity())
        } catch (error) {
            const response = new BaseResponse({}, false, 'Error sending message');
            res.status(500).json(response.toResponseEntity());
        }
    },
    forgotPasswordGet: async (req: Request, res: Response) => {
        const userExist = await userService.getUserByEmail(req.body.email);
        const newPassword = req.body.newPassword;

        if (newPassword.trim().length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        if (!userExist) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (userExist?.code === undefined) {
            return res.status(400).json({ error: 'No se ha iniciado el proceso de recovery' });
        }

        if (userExist.code == req.params.code) {
            const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
            await userService.update(userExist!.uuid, { code: null, code_created_at: new Date(), password: hashedPassword });;
            const response = new BaseResponse({}, true, 'Password changed');
            res.status(200).json(response.toResponseEntity())
        } else {
            const response = new BaseResponse({}, false, 'Error recovering account');
            res.status(400).json(response.toResponseEntity())
        }
    }

};

