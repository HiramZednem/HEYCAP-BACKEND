import { prisma } from '../db/db';

export const itineraryService = {
    getAll: async (user_id: number) => {
            return await prisma.itineraries.findMany({
                where: {
                    user_id: user_id
                }
            })
    },

    getById: async (uuid: string) => {
        return await prisma.itineraries.findUnique({
            where: {
                uuid: uuid
            }
        })
    },

    create: async (data: any) => {
        return await prisma.itineraries.create({
            data: data
        })
    },

    update: async (uuid: string, data: any) => {
        return await prisma.itineraries.update({
            where: {
                uuid: uuid
            },
            data: data
        })
    },
    
    delete: async (id: string) => {
        return await prisma.itineraries.delete({
            where: {
                uuid: id
            }
        })
    },
};