import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { OrderStatus } from '@ruciuxd/common';
import { natsWrapper } from '../../nats-wrapper';

it('Returns and error if the ticket doesnt exist', async () => {
    const ticketId = new mongoose.Types.ObjectId;

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
});

it('Returns and error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();
    const order = Order.build({
        ticket,
        userId: '12345',
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it('Reserves a ticket and emits event', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201)
        .expect(({ body }) => {
            expect(body.id).toBeDefined();
        });

    const order = await Order.findOne({});
    expect(order).toBeDefined();

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});