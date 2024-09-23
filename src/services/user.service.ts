import { prisma } from '../db/db';

export const userService = {
    getAll: async () => {
            return await prisma.users.findMany()
    },

    getById: async (id: number) => {
        return await prisma.users.findUnique({
            where: {
                user_id: id
            }
        })
    },

    create: async (data: any) => {
        return await prisma.users.create({
            data: data
        })
    },

    update: async (id: number, data: any) => {
        return await prisma.users.update({
            where: {
                user_id: id
            },
            data: data
        })
    },
    
    delete: async (id: number) => {
        return await prisma.users.delete({
            where: {
                user_id: id
            }
        })
    },

    getUserByEmail: async (email: string) => {
        return await prisma.users.findFirst({
            where: {
                email: email
            }
        })
    }
};