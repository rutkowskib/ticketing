import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/currentUser';
import { signInRouter } from './routes/signIn';
import { signOutRouter } from './routes/signOut';
import { signUpRouter } from './routes/signUp';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true,
}));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.get('*', () => { throw new NotFoundError() });
app.use(errorHandler);

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY not defined');
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('Connected to mongodb');
    } catch (e) {
        console.error(e);
    }

    app.listen(3000, () => {
        console.log('Auth service listening on 3000');
    });
};

start();


