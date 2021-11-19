import mongoose from 'mongoose';
import { app } from './app';

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


