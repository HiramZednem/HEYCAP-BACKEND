import { Request, Response } from 'express';
import { userService } from '../services';
import bcrypt, { hash } from 'bcrypt';
import jwt, { verify } from 'jsonwebtoken';
import { JWT_KEY, META_KEY, META_URL } from '../config';
import axios from 'axios';

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
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = await userService.create({...req.body, password: hashedPassword});
            return res.status(201).json(user);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const user = await userService.update(req.params.id, req.body);
            return res.status(200).json(user);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const user = await userService.delete(req.params.id);
            return res.status(200).json(user);
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

            return res.status(200).json({ user, token });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to login' });
        }
    },
    verifyNumberPost: async (req: Request, res: Response) => {
        try {
            const user = await userService.getById(req.params.id);

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
                    type: "text",
                    text: {
                        preview_url: true,  
                        body: `Tu código de verificación es: ${verificationCode}`
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
        const user = await userService.getById(req.params.id);
        if (user?.code === undefined) {
            return res.status(400).json({ error: 'No se ha iniciado el proceso de verificación' });
        }

        if (user.code == req.params.code) {
            // aqui tendria que actualizar a true bool
            return res.status(200).json({ message: 'Numero verificado' });
        } else {
            return res.status(400).json({ error: 'Codigo incorrecto' });
        }
    }

};
