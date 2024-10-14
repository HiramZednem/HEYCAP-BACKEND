import { Request, Response } from 'express';
import { notificationService, userService } from '../services';
import { BaseResponse } from '../dtos/base.response';
import { codeService } from '../services/code.service';
import { CodeType } from '@prisma/client';
import { jwtPlugin } from '../public';
import { tokenService } from '../services/token.service';

export const notificationController = {
    verifyNumberResendCode: async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            const {code, user} = await codeService.generateCode(email, CodeType.VERIFY);
            await notificationService.sendMetaVerificationCode(user.phone, code.code);

            const response = new BaseResponse({}, true, 'Message sent');
            res.status(200).json(response.toResponseEntity())
        } catch (error) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                const response = new BaseResponse({}, false, 'An unexpected error occurred');
                return res.status(500).json(response.toResponseEntity());
            }
        }
    },
    
    verifyNumberWithCode: async (req: Request, res: Response) => {
        try {
            const accessToken = req.app.locals.accessToken;
            const uuid = jwtPlugin.decode(accessToken).uuid;
            const tokenValid = await tokenService.validateToken(accessToken, uuid);

            const code = req.params.code;
            const type = CodeType.VERIFY;
            const user = await userService.getById(uuid);
            
            
            if ( tokenValid && await codeService.verifyCode(user.email, code, type) ) {
                const response = new BaseResponse({ user: userService.toUserResponse(user) }, true, 'Number verified');
                res.status(200).json(response.toResponseEntity())
            } else {
                throw new Error('Error verifying number');
            }
        } catch (error) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                const response = new BaseResponse({}, false, 'An unexpected error occurred');
                return res.status(500).json(response.toResponseEntity());
            }
        }
        
    },

    authLogin: async (req: Request, res: Response) => {
        try {
            const accessToken = req.app.locals.accessToken;
            const uuid = jwtPlugin.decode(accessToken).uuid;
            const tokenValid = await tokenService.validateToken(accessToken, uuid);

            const user = await userService.getById(uuid);
            const code = req.params.code;
            const type = CodeType.LOGIN;

            if ( tokenValid && await codeService.verifyCode(user.email, code, type) ) {
                const response = new BaseResponse({ user: userService.toUserResponse(user) }, true, 'Login success');
                res.status(200).json(response.toResponseEntity())
            } else {
                throw new Error('Error loggin in');
            }
        } catch (error) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                const response = new BaseResponse({}, false, 'An unexpected error occurred');
                return res.status(500).json(response.toResponseEntity());
            }
        }
    },

    forgotPassword: async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            const {code, user}= await codeService.generateCode(email, CodeType.RECOVERY);
            await notificationService.sendMetaVerificationCode(user.phone,code.code);
            const response = new BaseResponse({}, true, 'Message sent');
            res.status(200).json(response.toResponseEntity())
        } catch (error) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                const response = new BaseResponse({}, false, 'An unexpected error occurred');
                return res.status(500).json(response.toResponseEntity());
            }
        }
    },

    forgotPasswordGet: async (req: Request, res: Response) => {
        try {
            const newPassword = req.body.newPassword;

            const email = req.body.email;
            const code = req.params.code;
            const type = CodeType.RECOVERY;
            

            if ( await codeService.verifyCode(email, code, type) ) {
                await userService.updatePassword(email, newPassword);

                const response = new BaseResponse({}, true, 'Password successfully updated');
                res.status(200).json(response.toResponseEntity())
            } else {
                throw new Error('Error verifying code');
            }
        } catch (error) {
            if (error instanceof Error) {
                const response = new BaseResponse({}, false, error.message);
                res.status(500).json(response.toResponseEntity());
            } else {
                const response = new BaseResponse({}, false, 'An unexpected error occurred');
                return res.status(500).json(response.toResponseEntity());
            }
        }
       
    }

};

