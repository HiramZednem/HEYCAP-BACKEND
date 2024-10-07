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

    login : async (email: string, password: string) => {
        const user: UserResponse | null = await userService.getUserByEmail(email);
            // if (!user) {
            //     return res.status(404).json({ error: 'User not found' });
            // }
            // const passwordMatch = await bcrypt.compare(password, user.password);
            // if (!passwordMatch) {
            //     return res.status(401).json({ error: 'Invalid password' });
            // }
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