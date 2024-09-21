import { Request, Response } from 'express';
import { userService } from '../services';


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
            return res.status(201).json(user);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const user = await userService.create(req.body);
            return res.status(200).json(user);
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
    }

};
