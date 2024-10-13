import { Request, Response } from 'express';
import { notificationService, userService } from '../services';
import bcrypt, { hash } from 'bcrypt';
import jwt, { verify } from 'jsonwebtoken';
import { JWT_KEY } from '../config';
import { UserRequest } from './dtos/request/userRequest';
import { BaseResponse } from './dtos/base.response';

export const userController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const users = await userService.getAll();
            const response = new BaseResponse(users, true, 'All users');
            res.status(200).json(response.toResponseEntity());
        } catch (e) {
            const response = new BaseResponse({}, false, 'Error getting users');
            res.status(500).json(response.toResponseEntity());
        }
    },
    getById: async (req: Request, res: Response) => {
        try {
            const user = await userService.getById(req.params.id);
            const response = new BaseResponse(user, true, 'User found');
            res.status(200).json(response.toResponseEntity());
        } catch (e) {
            const response = new BaseResponse({}, false, 'Error getting user');
            res.status(500).json(response.toResponseEntity());
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const userRequest: UserRequest = req.body;

            if (userRequest.phone.trim().length != 10) {
                return res.status(400).json({ error: 'Phone must be 10 characters long' });
            }

            if (userRequest.password.trim().length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters long' });
            }

            const userByEmail = await userService.getUserByEmail(userRequest.email);
            const userByNickname = await userService.getUserByNickname(userRequest.nickname);
            const userByPhone = await userService.getUserByPhone(userRequest.phone);

            if (userByEmail) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            if (userByNickname) {
                return res.status(400).json({ error: 'Nickname already in use' });
            }
            if (userByPhone) {
                return res.status(400).json({ error: 'Phone already in use' });
            }
            

            const hashedPassword = await bcrypt.hash(userRequest.password.trim(), 10);
            const user = await userService.create({...userRequest, password: hashedPassword});

            const verificationCode = await notificationService.sendMetaVerificationCode(user.phone);
            await userService.update(user.uuid, { code: verificationCode, code_created_at: new Date() });
            const token = jwt.sign({ user }, JWT_KEY as string, { expiresIn: "12h" });
            const response = new BaseResponse({token}, true, 'User created, verify your account via whatsapp');
            res.status(201).json(response.toResponseEntity());
        } catch (e) {
            const response = new BaseResponse({}, false, 'Error creating user');
            res.status(500).json(response.toResponseEntity());
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const userId = req.params.id;
            const userRequest = req.body

            const currentUser = await userService.getById(userId);

            if (!currentUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Validar solo si se está intentando cambiar el email
            if (userRequest.email && userRequest.email !== currentUser.email) {
                const userByEmail = await userService.getUserByEmail(userRequest.email);
                if (userByEmail) {
                    return res.status(400).json({ error: 'Email already in use' });
                }
            }

            // Validar solo si se está intentando cambiar el nickname
            if (userRequest.nickname && userRequest.nickname !== currentUser.nickname) {
                const userByNickname = await userService.getUserByNickname(userRequest.nickname);
                if (userByNickname) {
                    return res.status(400).json({ error: 'Nickname already in use' });
                }
            }

            // Validar solo si se está intentando cambiar el phone
            if (userRequest.phone && userRequest.phone !== currentUser.phone) {
                const userByPhone = await userService.getUserByPhone(userRequest.phone);
                if (userByPhone) {
                    return res.status(400).json({ error: 'Phone already in use' });
                }
            }

            // Si todas las validaciones pasan, proceder con la actualización
            const updatedUser = await userService.update(userId, userRequest);
            const response = new BaseResponse(updatedUser, true, 'User updated successfully');
            res.status(200).json(response.toResponseEntity());

        } catch (e) {
            const response = new BaseResponse({}, false, 'Error updating user');
            res.status(500).json(response.toResponseEntity())
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const user = await userService.delete(req.params.id);
            if (!user) {
                return res.status(500).json({error: 'Error deleting user'});
            }

            const response = new BaseResponse({}, true, 'User deleted successfully');
            res.status(200).json(response.toResponseEntity());
        } catch (e) {
            const response = new BaseResponse({}, false, 'Error deleting user');
            res.status(500).json(response.toResponseEntity());
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            
            const user = await userService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            const verificationCode = await notificationService.sendMetaVerificationCode(user.phone);
            await userService.update(user.uuid, { code: verificationCode, code_created_at: new Date() });
            const token = jwt.sign({ user }, JWT_KEY as string, { expiresIn: "12h" });
            const response = new BaseResponse({token}, true, 'User logged in, verify your account via whatsapp');
            res.status(200).json(response.toResponseEntity());
        } catch (error) {
            const response = new BaseResponse({}, false, 'Error logging in');
            res.status(500).json(response.toResponseEntity());
        }
    }

};

