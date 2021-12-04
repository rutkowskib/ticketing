import { Listener, OrderCreatedEvent, Subjects } from '@ruciuxd/common';
import { QUEUE_GROUP_NAME } from './const';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = QUEUE_GROUP_NAME;

    async onMessage(data: OrderCreatedEvent["data"], message: Message): Promise<void> {
        const order = Order.build({
            id: data.id,
            status: data.status,
            price: data.ticket.price,
            version: data.version,
            userId: data.userId,
        });
        await order.save();

        message.ack();
    }
}