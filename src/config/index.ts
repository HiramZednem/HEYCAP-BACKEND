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
export const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
export const GOOGLE_PRIVATE_KEY_ID = process.env.GOOGLE_PRIVATE_KEY_ID;
export const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
export const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_AUTH_URI = process.env.GOOGLE_AUTH_URI;
export const GOOGLE_TOKEN_URI = process.env.GOOGLE_TOKEN_URI;
export const GOOGLE_CERT_URL = process.env.GOOGLE_CERT_URL;
export const GOOGLE_CLIENT_CERT_URL = process.env.GOOGLE_CLIENT_CERT_URL;

