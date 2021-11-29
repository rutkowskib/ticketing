import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { OrderStatus } from '@ruciuxd/common';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('Marks an order as cancelled and publishes event', async () => {
    const ticket = await Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),

    });
    await ticket.save();

    const user = global.signin();

    let orderId = '';
    await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)
        .expect(({ body }) => { orderId = body.id });

    await request(app)
        .delete(`/api/orders/${orderId}`)
        .set('Cookie', user)
        .expect(200);

    const order = await Order.findById(orderId);
    expect(order!.status).toEqual(OrderStatus.Cancelled);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
