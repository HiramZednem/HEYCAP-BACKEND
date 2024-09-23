import { prisma } from '../db/db';

export const userService = {
    getAll: async () => {
            return await prisma.users.findMany()
    },

    getById: async (uuid: string) => {
        return await prisma.users.findUnique({
            where: {
                uuid: uuid
            }
        })
    },

    create: async (data: any) => {
        return await prisma.users.create({
            data: data
        })
    },

    update: async (uuid: string, data: any) => {
        return await prisma.users.update({
            where: {
                uuid: uuid
            },
            data: data
        })
    },
    
    delete: async (id: string) => {
        return await prisma.users.delete({
            where: {
                uuid: id
            }
        })
    },

    getUserByEmail: async (email: string) => {
        return await prisma.users.findFirst({
            where: {
                email: email
            }
        })
    },
};