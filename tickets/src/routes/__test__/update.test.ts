import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';

it('Returns 404 if ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'asdsad',
            price: 20,
        })
        .expect(404);
});

it('Returns 401 if user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'asdsad',
            price: 20,
        })
        .expect(401);

});

it('Returns 401 if user doesnt own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'asdsad',
            price: 20,
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'asdsad',
            price: 20,
        })
        .expect(401);

});

it('Returns 400 if user provides and invalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdsad',
            price: 20,
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'asd',
            price: -1,
        })
        .expect(400);
});

it('Returns 200 and updates ticket', async () => {
    const cookie = global.signin();
    const title = 'NEW_TITLE';
    const price = 200;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdsad',
            price: 20,
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title,
            price,
        })
        .expect(200);

    const updatedTicket = await Ticket.findById(response.body.id);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(title);
    expect(updatedTicket!.price).toEqual(price);
});
