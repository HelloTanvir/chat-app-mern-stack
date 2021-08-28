import { IPeople } from "./models/People";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_URL: string;
      FRONTEND_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      JWT_COOKIE_EXPIRE: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      NODE_ENV: 'production' | 'development';
    }

    // interface Global {
    //   io: socket.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
    // }
  }

  namespace Express {
    interface Request {
      user: IPeople;
    }
  }
}

export { };

