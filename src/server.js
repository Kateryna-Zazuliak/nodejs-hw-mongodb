import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import { env } from './utils/env.js';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = Number(env('PORT', '3000'));
export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());
  app.use(cookieParser());
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
