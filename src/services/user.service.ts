import { UserRequest } from '../dtos/request/userRequest';
import { UserResponse } from '../dtos/response/userResponse';
import { prisma } from '../db/db';
import { bcryptPlugin } from '../public';
import { notificationService } from './notification.service';
import { codeService } from './code.service';
import { CodeType } from '@prisma/client';

export const userService = {
    getById: async (uuid: string) => {
        const user: UserRequest | null = await prisma.users.findUnique({
            where: {
                uuid: uuid
            }
        })

        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    create: async (userRequest: UserRequest) => {
       
        userService.verifyUser(userRequest);
        
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                { email: userRequest.email.trim().toLowerCase() },
                { nickname: userRequest.nickname.trim() },
                { phone: userRequest.phone.trim() }
                ]
            }
        });
        
        if (existingUser) {
            if (existingUser.email === userRequest.email.trim().toLowerCase()) {
                throw new Error('Email already in use');
            }
            if (existingUser.nickname === userRequest.nickname.trim()) {
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
                name: userRequest.name.trim(),
                last_name: userRequest.last_name.trim(),
                nickname: userRequest.nickname.trim(),
                email: userRequest.email.trim().toLowerCase(),
                password: hashedPassword
            }
        })
        return userService.toUserResponse(createdUser)
    },

    update: async (uuid: string, data: any) => {
        // TODO: manejar validaciones aca
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
                email: email.trim().toLowerCase()
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
    loginVerify: async (email: string, password: string) => {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            throw new Error('User does not exist');
        }
        const isPasswordValid = await bcryptPlugin.comparePassword(password, user.password);
        if (isPasswordValid) {
            const {code, user} = await codeService.generateCode(email, CodeType.VERIFY);
            await notificationService.sendMetaVerificationCode(user.phone, code.code);
            return userService.toUserResponse(user);
        } else {
            throw new Error('Invalid password');
        }
    },

    getUserByEmail: async (email: string) => {
        const user = await prisma.users.findFirst({
            where: {
            email: email.toLowerCase().trim()
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
    },
    verifyUser: (userRequest: UserRequest) => {
        if (userRequest?.phone.trim().length !== 10 || isNaN(Number(userRequest.phone))) {
            throw new Error('Phone must be 10 numeric characters long');
        }

        if (userRequest?.password.trim().length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userRequest?.email.trim())) {
            throw new Error('Invalid email format');
        }
        if (userRequest?.nickname.trim().length < 4) {
            throw new Error('Nickname must be at least 4 characters long');
        }
        if (userRequest?.name.trim().length < 2) {
            throw new Error('Name must be at least 2 characters long');
        }
        if (userRequest?.last_name.trim().length < 2) {
            throw new Error('Last name must be at least 2 characters long');
        }
    }
};

