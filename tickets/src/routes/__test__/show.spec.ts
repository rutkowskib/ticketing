import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('Returns 404 if ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .expect(404);
});

it('Returns 200 and ticket', async () => {
    const TITLE = 'title';
    const PRICE = 20;

    const { body } = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: TITLE,
            price: PRICE,
        })
        .expect(201);

    await request(app)
        .get(`/api/tickets/${body.id}`)
        .expect(200)
        .expect(({ body }) => {
            expect(body.title).toEqual(TITLE);
            expect(body.price).toEqual(PRICE);
        });
});