import { prisma } from '../db/db';


export const gymService = {
    getAll: async () => {
            return await prisma.gyms.findMany()
    },
    getById: async (id: number) => {
        return await prisma.gyms.findUnique({
            where: {
                id: id
            }
        })
    },
    create: async (data: any) => {
        return await prisma.gyms.create({
            data: data
        })
    },
    update: async (id: number, data: any) => {
        return await prisma.gyms.update({
            where: {
                id: id
            },
            data: data
        })
    },
    delete: async (id: number) => {
        return await prisma.gyms.delete({
            where: {
                id: id
            }
        })
    }
};