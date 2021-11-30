import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const start = async () => {
    const envVariables = [ 'JWT_KEY', 'MONGO_URI', 'NATS_URL', 'CLUSTER_ID', 'NATS_CLIENT_ID' ];
    envVariables.forEach((variable: string) => {
        if (!process.env[variable]) {
            throw new Error(`${variable} not defined`);
        }
    });
    try {
        await natsWrapper.connect(process.env.CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to mongodb');
    } catch (e) {
        console.error(e);
        process.exit();
    }

    app.listen(3000, () => {
        console.log('Tickets service listening on 3000');
    });
};

start();


