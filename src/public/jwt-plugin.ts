import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config';

export const jwtPlugin = {
    sign: (data: {uuid: string}) => {
        return jwt.sign(data, JWT_KEY as string, { expiresIn: "1h" });
    },
    verify: (token: string) => {
        return jwt.verify(token, JWT_KEY as string) as any;
    },
    decode: (token: string) => {
        return jwt.decode(token) as any;
    }
}
