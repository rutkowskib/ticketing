import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import mongoose from 'mongoose';

it('Fetches order', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    const user = global.signin();

    let orderId: string = '';

    await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)
        .expect(({ body }) => { orderId = body.id });

    await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie', user)
        .expect(200)
        .expect(({ body }) => body.id === orderId);
});

it('Returns error for not existing order on not made by user', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    const user = global.signin();
    let orderId: string = '';

    await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)
        .expect(({ body }) => { orderId = body.id });

    await request(app)
        .get(`/api/orders/${new mongoose.Types.ObjectId}`)
        .set('Cookie', user)
        .expect(404);

    await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie', global.signin())
        .expect(404);
});