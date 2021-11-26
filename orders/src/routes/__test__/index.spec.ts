import { Ticket } from '../../models/ticket';
import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => {
    const ticket = Ticket.build({
        title: 'title',
        price: 20,
    });
    await ticket.save();
    return ticket;
};

it('Fetches orders for user', async () => {
    const [ ticket1, ticket2, ticket3 ] = await Promise.all([
        createTicket(),
        createTicket(),
        createTicket(),
    ]);

    const [ user1, user2 ] = await Promise.all([ signin(), signin() ]);
    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201);
    await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket2.id })
        .expect(201);
    await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201);

    await request(app)
        .get('/api/orders')
        .set('Cookie', user1)
        .expect(200)
        .expect(({ body }) => expect(body).toHaveLength(1));

    await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200)
        .expect(({ body }) => expect(body).toHaveLength(2));
});