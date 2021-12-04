import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteEvent, OrderStatus } from '@ruciuxd/common';
import { Ticket } from '../../../models/ticket';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order } from '../../../models/order';

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = await Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(),
        ticket,
    });
    await order.save();

    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    };

    return { listener, ticket, order, data, message };
};

it('Updates orders status to cancelled, emits order cancelled and acks message', async () => {
    const { order, message, data, listener } = await setup();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
    expect(message.ack).toHaveBeenCalled();
});

