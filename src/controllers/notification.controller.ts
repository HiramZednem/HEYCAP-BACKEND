import { Request, Response } from 'express';
import { notificationService, userService } from '../services';
import { BaseResponse } from '../dtos/base.response';
import { codeService } from '../services/code.service';
import { CodeType } from '@prisma/client';
import { jwtPlugin } from '../public';

export const notificationController = {
    verifyNumberPost: async (req: Request, res: Response) => {
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
    
    verifyNumberGet: async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            const code = req.params.code;
            const type = CodeType.VERIFY;
            
            
            if ( await codeService.verifyCode(email, code, type) ) {
                const user = await userService.getUserByEmail(email);
                const token = jwtPlugin.sign({uuid: user.uuid});

                const response = new BaseResponse({ user: userService.toUserResponse(user), token }, true, 'Number verified');
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

    authLoginGet: async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            const code = req.params.code;
            const type = CodeType.LOGIN;

            if ( await codeService.verifyCode(email, code, type) ) {
                const user = await userService.getUserByEmail(email);
                const token = jwtPlugin.sign({uuid: user.uuid});

                const response = new BaseResponse({ user: userService.toUserResponse(user), token }, true, 'Login success');
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

