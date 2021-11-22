import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('Has handler for /api/tickets post request', async () => {
    await request(app)
        .post('/api/tickets')
        .expect(({ statusCode }) => expect(statusCode).not.toEqual(404));
});

it('Can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/tickets')
        .expect(401);
});

it('Returns status other than 401 when user is logged in', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .expect(({ statusCode }) => expect(statusCode).not.toEqual(401));
});


it('Returns error when invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: '123456',
        })
        .expect(400);
});

it('Returns error when invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Title',
            price: -1,
        })
        .expect(400);
});

it('Should create ticket', async () => {
    let tickets = await Ticket.find({});
    expect(tickets).toHaveLength(0);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Title',
            price: 12345,
        })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets).toHaveLength(1);

});