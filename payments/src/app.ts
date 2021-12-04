import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ruciuxd/common';
import { createChargeRouter } from './routes/new';

export const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}));
app.use(createChargeRouter);

app.get('*', () => { throw new NotFoundError() });
app.use(errorHandler);