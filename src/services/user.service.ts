import { UserRequest } from '../dtos/request/userRequest';
import { UserResponse } from '../dtos/response/userResponse';
import { prisma } from '../db/db';
import { bcryptPlugin } from '../public';
import { notificationService } from './notification.service';
import { codeService } from './code.service';
import { CodeType } from '@prisma/client';

export const userService = {
    getAll: async () => {
        const users: UserRequest[] | null = await prisma.users.findMany()
        return users.map((user) => userService.toUserResponse(user))
    },

    getById: async (uuid: string) => {
        const user: UserRequest | null = await prisma.users.findUnique({
            where: {
                uuid: uuid
            }
        })

        if (!user) {
            throw new Error('User not found');
        }
        return userService.toUserResponse(user!)
    },

    create: async (userRequest: UserRequest) => {
        if (userRequest.phone.trim().length !== 10 || isNaN(Number(userRequest.phone))) {
            throw new Error('Phone must be 10 numeric characters long');
        }

        if (userRequest.password.trim().length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                { email: userRequest.email },
                { nickname: userRequest.nickname },
                { phone: userRequest.phone }
                ]
            }
        });
        
        if (existingUser) {
            if (existingUser.email === userRequest.email) {
                throw new Error('Email already in use');
            }
            if (existingUser.nickname === userRequest.nickname) {
                throw new Error('Nickname already in use');
            }
            if (existingUser.phone === userRequest.phone) {
                throw new Error('Phone already in use');
            }
        }
        

        const hashedPassword = await bcryptPlugin.hashPassword(userRequest.password);
        const createdUser = await prisma.users.create({
            data: {
                ...userRequest,
                password: hashedPassword
            }
        })
        return userService.toUserResponse(createdUser)
    },

    update: async (uuid: string, data: any) => {
        const updatedUser: UserRequest =  await prisma.users.update({
            where: {
                uuid: uuid
            },
            data: data
        })
        return userService.toUserResponse(updatedUser);
    },

    delete: async (id: string) => {
        await userService.getById(id);
        return await prisma.users.delete({
            where: {
                uuid: id
            }
        })
    },
    updatePassword: async (email: string, password: string) => {
        if (password.trim().length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        const hashedPassword = await bcryptPlugin.hashPassword(password);
        const updatedUser: UserRequest =  await prisma.users.update({
            where: {
                email: email
            },
            data: {
                password: hashedPassword
            }
        })
        
        return userService.toUserResponse(updatedUser);
    },

    login: async (email: string, password: string) => {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            throw new Error('User does not exist');
        }
        if (!user.phoneVerified) {
            throw new Error('Phone not verified');
        }
        const isPasswordValid = await bcryptPlugin.comparePassword(password, user.password);
        if (isPasswordValid) {
            const {code, user} = await codeService.generateCode(email, CodeType.LOGIN);
            await notificationService.sendMetaVerificationCode(user.phone, code.code);
            return userService.toUserResponse(user);
        } else {
            throw new Error('Invalid password');
        }
    },

    getUserByEmail: async (email: string) => {
        const user = await prisma.users.findFirst({
            where: {
            email: email
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
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
    toUserResponse: (user: UserRequest): UserResponse => {
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
};

