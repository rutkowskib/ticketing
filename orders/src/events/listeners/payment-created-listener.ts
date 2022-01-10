import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from '@ruciuxd/common';
import { QUEUE_GROUP_NAME } from './const';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = QUEUE_GROUP_NAME;

    async onMessage(data: PaymentCreatedEvent["data"], message: Message): Promise<void> {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Complete });
        await order.save();

        message.ack();
    }
}