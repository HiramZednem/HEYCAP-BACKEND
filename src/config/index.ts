import { config } from 'dotenv'

if(process.env.NODE_ENV !== 'production'){
  config();
}

export const PORT = process.env.PORT;
export const JWT_KEY= process.env.JWT_KEY;
export const META_KEY= process.env.META_KEY;
export const META_URL= process.env.META_URL;
export const MP_ACCESS_TOKEN= process.env.MP_ACCESS_TOKEN;
export const TUNEL_URL= process.env.TUNEL_URL;
export const GOOGLE_KEY= process.env.GOOGLE_KEY;

