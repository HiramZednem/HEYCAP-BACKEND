import { Request, Response } from 'express';
import { userService } from '../services';
import bcrypt, { hash } from 'bcrypt';
import jwt, { verify } from 'jsonwebtoken';
import { JWT_KEY, META_KEY, META_URL } from '../config';
import axios from 'axios';
import { UserRequest } from './dtos/request/userRequest';
import { UserResponse } from './dtos/response/userResponse';

export const userController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const users = await userService.getAll();
            return res.status(200).json(users);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    getById: async (req: Request, res: Response) => {
        try {
            const user = await userService.getById(req.params.id);
            return res.status(200).json(user);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
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
            return res.status(201).json(user);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
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
            return res.status(200).json(updatedUser);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const user = await userService.delete(req.params.id);
            return res.status(200).json('User deleted successfully');
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
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


            const token = jwt.sign({ user }, JWT_KEY as string, { expiresIn: "12h" });

            const userResponse = await userService.getById(user.uuid);
            return res.status(200).json({ user: userResponse, token });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to login' });
        }
    },
    verifyNumberPost: async (req: Request, res: Response) => {
        try {
            const user = await userService.getById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (user?.phone === undefined) {
                return res.status(404).json({ error: 'Add a phone number first' });
            }

            if (user?.phoneVerified) {
                return res.status(400).json({ error: 'Phone already verified' });
            }

            const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
            await userService.update(user.uuid, { code: verificationCode, code_created_at: new Date() });

            const response = await axios.post(
                META_URL!,
                {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: `+52${user.phone}`,
                    type: "template",
                    template: {
                        name: "authentication",
                        language: {
                            code: "en_US"
                        },
                        components: [
                            {
                                type: "body",
                                parameters: [
                                    {
                                        type: "text",
                                        text: verificationCode
                                    }
                                ]
                            },
                            {
                                type: "button",
                                sub_type: "url",
                                index: "0",
                                parameters: [
                                    {
                                        type: "text",
                                        text: verificationCode
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${META_KEY}`  // Token de acceso de Meta
                    }
                }
            );
            return res.status(200).json({ message: 'Mensaje enviado' });
        } catch (error) {
            return res.status(500).json({ error: 'Error al enviar mensaje' });
        }
    },
    verifyNumberGet: async (req: Request, res: Response) => {
        const userExist = await userService.getById(req.params.id);

        if (!userExist) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = await userService.getUserByEmail(userExist.email);

        if (user?.code === undefined) {
            return res.status(400).json({ error: 'No se ha iniciado el proceso de verificación' });
        }

        if (user.code == req.params.code) {
            await userService.update(user!.uuid, { code: null, code_created_at: new Date() });;
            return res.status(200).json({ message: 'Numero verificado' });
        } else {
            return res.status(400).json({ error: 'Codigo incorrecto' });
        }
    }

};
