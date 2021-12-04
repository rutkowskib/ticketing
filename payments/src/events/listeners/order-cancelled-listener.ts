import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from '@ruciuxd/common';
import { QUEUE_GROUP_NAME } from './const';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = QUEUE_GROUP_NAME;

    async onMessage(data: OrderCancelledEvent["data"], message: Message): Promise<void> {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1,
        });

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        message.ack();
    }
}