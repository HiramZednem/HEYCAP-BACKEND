import { config } from 'dotenv'

if(process.env.NODE_ENV !== 'production'){
  config();
}

export const PORT = process.env.PORT;
export const JWT_KEY= process.env.JWT_KEY;