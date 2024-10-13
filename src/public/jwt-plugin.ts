import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config';

export const jwtPlugin = {
    sign: (data: {uuid: string}) => {
        return jwt.sign(data, JWT_KEY as string, { expiresIn: "1h" });
    },
}
