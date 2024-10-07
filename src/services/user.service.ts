import { UserRequest } from '../controllers/dtos/request/userRequest';
import { UserResponse } from '../controllers/dtos/response/userResponse';
import { prisma } from '../db/db';

export const userService = {
    getAll: async () => {
        const users: UserRequest[] | null = await prisma.users.findMany()
        return users.map((user) => toUserResponse(user))
    },

    getById: async (uuid: string) => {
        const user: UserRequest | null = await prisma.users.findUnique({
            where: {
                uuid: uuid
            }
        })
        return toUserResponse(user!)
    },

    create: async (data: any) => {
        const createdUser:UserRequest = await prisma.users.create({
            data: data
        })
        return toUserResponse(createdUser)
    },

    update: async (uuid: string, data: any) => {
        const updatedUser: UserRequest =  await prisma.users.update({
            where: {
                uuid: uuid
            },
            data: data
        })
        return toUserResponse(updatedUser);
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

    getUserByNickname: async (nickname: string) => {
        return await prisma.users.findFirst({
            where: {
                nickname: nickname
            }
        })
    },

    getUserByPhone: async (phone: string) => {
        return await prisma.users.findFirst({
            where: {
                phone: phone
            }
        })
    },
};

const toUserResponse = (user: UserRequest): UserResponse => {
    return {
        uuid: user.uuid,
        name: user.name,
        last_name: user.last_name,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        avatar: user.avatar
    };
}