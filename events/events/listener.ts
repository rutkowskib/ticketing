import { Message, Stan, SubscriptionOptions } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract readonly subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(parsedMessage: T['data'], message: Message): void;

    protected ackWait: number = 5 * 1000;
    private client: Stan;

    constructor(client: Stan) {
        this.client = client;

    }

    subscriptionOptions(): SubscriptionOptions {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions(),
        );

        subscription.on('message', (message: Message) => {
            console.log(`Message received ${this.subject} / ${this.queueGroupName}`);
            const parsedMessage = this.parseMessage(message);
            this.onMessage(parsedMessage, message);
        });
    }

    parseMessage(message: Message) {
        const data = message.getData();
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
    }
}