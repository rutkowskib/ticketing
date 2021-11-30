import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './listeners/order-created-listener';

const start = async () => {
    const envVariables = [ 'NATS_URL', 'CLUSTER_ID', 'NATS_CLIENT_ID', 'REDIS_HOST' ];
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
    } catch (e) {
        console.error(e);
        process.exit();
    }

    console.log('Expiration service running');
};

start();


