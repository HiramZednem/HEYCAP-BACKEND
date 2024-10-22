import { CodeType } from '@prisma/client';
import { prisma } from '../db/db';
import { userService } from './user.service';


export const codeService = {
    generateCode: async (email: string, type: CodeType) => {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const user = await userService.getUserByEmail(email);

        if (type == CodeType.VERIFY && user.phoneVerified) {
            throw new Error('Phone already verified');
        }
        
        // Primero borra, si existe, cualquier código previo
        await prisma.codes.deleteMany({
            where: {
                user_id: user.user_id, 
            }
        });

        // Para aqui poder crear el codigo
        const newCode = await prisma.codes.create({
            data: {
                code: code,           
                code_type: type,      
                user: { connect: { user_id: user.user_id } }, 
            }
        });

        return {code: newCode, user};
    },

    verifyCode: async (email: string, code: string, type: CodeType) => {
        const user = await userService.getUserByEmail(email);

        // si el numero no esta verificado tiro un error
        if (user.phoneVerified && type === CodeType.VERIFY) {
            throw new Error('Phone already verified');
        }

        const codeRecord = await prisma.codes.findFirst({
            where: {
                user_id: user.user_id,
                code: code
            }
        });
        // si no existe el codigo le mando un error
        if (!codeRecord) {
            throw new Error('Invalid code');
        }

        // si el codigo ya expiro lo borro y le mando un error
        if ( (new Date().getTime() - new Date(codeRecord.created_at).getTime()) > 10 * 60 * 1000) {
            await prisma.codes.delete({
                where: {
                    user_id: user.user_id
                }
            });
            throw new Error('Code expired. Please request a new code.');
        }

        
        // si el codigo no es del tipo que se espera le mando un error
        if (codeRecord.code_type !== type) {
            throw new Error(`Invalid code type. Expected ${type}, but received ${codeRecord.code_type}`);
        }


        if (codeRecord.code_type === CodeType.VERIFY) {
            await userService.update(user.uuid, { phoneVerified: true });
        }

        // si todo esta bien borro el codigo y retorno true
        await prisma.codes.delete({
            where: {
                user_id: user.user_id
            }
        });
        return true;
    }

};

