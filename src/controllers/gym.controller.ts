import { Request, Response } from 'express';
import { gymService } from '../services/gym.service';


export const gymController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const gyms = await gymService.getAll();
            return res.status(200).json(gyms);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    getById: async (req: Request, res: Response) => {
        try {
            const gym = await gymService.getById(parseInt(req.params.id));
            return res.status(201).json(gym);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const gym = await gymService.create(req.body);
            return res.status(200).json(gym);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const gym = await gymService.update(parseInt(req.params.id), req.body);
            return res.status(200).json(gym);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const gym = await gymService.delete(parseInt(req.params.id));
            return res.status(200).json(gym);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    }

};
