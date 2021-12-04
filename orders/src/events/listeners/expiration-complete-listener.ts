import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from '@ruciuxd/common';
import { QUEUE_GROUP_NAME } from './const';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = QUEUE_GROUP_NAME;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent["data"], message: Message): Promise<void> {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) {
            throw new Error('Order not found');
        }
        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            }
        });

        message.ack();
    }
}