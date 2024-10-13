import bcrypt from 'bcrypt';

export const bcryptPlugin = {
    hashPassword: async (password: string) => {
        return await bcrypt.hash(password.trim(), 10);
    },
    comparePassword: async (password: string, hashedPassword: string) => {
        return await bcrypt.compare(password.trim(), hashedPassword);
    }
}
