import { CodeType } from '@prisma/client';
import { prisma } from '../db/db';
import { userService } from './user.service';
import { jwtPlugin } from '../public';


export const tokenService = {

    // todos los token van a durar una hora
    createToken: async (user_uuid: string) => {
        try {
            const user = await userService.getById(user_uuid);

            const validAt = new Date();
            validAt.setHours(validAt.getHours() + 1);
    
            const tokenValue = jwtPlugin.sign({ uuid: user_uuid });

            const token = await prisma.tokens.create({
                data: {
                    valid_at: validAt,
                    user_id: user.user_id,
                    status: 'ACTIVE',
                    custom_settings: {
                        create: {
                            key: tokenValue,
                            key_value: '1h'
                        }
                    }
                }
            });
        
            return tokenValue;
        } catch {
            throw new Error('Error creating token');
        }
    },
    validateToken: async (tokenValue: string, uuid: string) => {
        // Obtener al usuario por su UUID
        const user = await userService.getById(uuid);
        
        // Buscar el token por su valor
        const token = await prisma.tokens.findFirst({
            where: {
                custom_settings: {
                    some: {
                        key: tokenValue // Comparar el valor del token
                    }
                }
            },
            include: { user: true } // Incluir información del usuario si es necesario
        });
    
        // Verificar si el token no existe
        if (!token) {
            throw new Error('Token no encontrado');
        }
    
        // Verificar si el token está inactivo o ha expirado
        const tokenExpired = token.valid_at && new Date() > new Date(token.valid_at);
        if (token.status === 'INACTIVE' || tokenExpired) {
            // Si el token ha expirado pero aún no se ha actualizado su estado
            if (token.status !== 'INACTIVE') {
                await prisma.tokens.update({
                    where: { token_id: token.token_id },
                    data: { status: 'INACTIVE' }
                });
            }
            throw new Error('Token no válido o ha expirado');
        }
    
        // Si todo está correcto, devolver true
        return true;
    }
    
};

