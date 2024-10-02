import { Request, Response } from 'express';
import { itineraryService, userService } from '../services';


export const itineraryController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const user = await userService.getById(req.params.userid);
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }

            const itineraries = await itineraryService.getAll(user.user_id);
            return res.status(200).json(itineraries);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    getById: async (req: Request, res: Response) => {
        try {
            const itinerary = await itineraryService.getById(req.params.id);
            return res.status(200).json(itinerary);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const user = await userService.getById(req.params.userid);
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }

            const itinerary = await itineraryService.create({...req.body, user_id: user.user_id});
            return res.status(201).json(itinerary);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    update: async (req: Request, res: Response) => {
        try {

            const itineraryExist = await itineraryService.getById(req.params.id);
            if (!itineraryExist) {
                return res.status(400).json({ error: 'Itinerary not found' });
            }
            const itinerary = await itineraryService.update(req.params.id, req.body);
            return res.status(200).json(itinerary);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const itineraryExist = await itineraryService.getById(req.params.id);
            if (!itineraryExist) {
                return res.status(400).json({ error: 'Itinerary not found' });
            }
            
            const itinerary = await itineraryService.delete(req.params.id);
            return res.status(200).json(itinerary);
        } catch (e) {
            res.status(500).json({ error: (e as Error).message });
        }
    },
};
