import { Request, Response } from 'express';
import { userService } from '../services';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config';

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
            const user = await userService.getById(Number(req.params.id));
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
            const user = await userService.update(Number(req.params.id), req.body);
            return res.status(200).json(user);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const user = await userService.delete(Number(req.params.id));
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
            res.status(500).json({ error: 'Failed to login' });
        }
    },

};
