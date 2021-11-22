import request from 'supertest';
import { app } from '../../app';

it('Returns 200 and ticket list', async () => {
    const TITLE = 'title';
    const PRICE = 20;

    const create = () => request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: TITLE,
            price: PRICE,
        })
        .expect(201);
    await Promise.all([
        create(),
        create(),
        create(),
    ]);

    await request(app)
        .get(`/api/tickets`)
        .expect(200)
        .expect(({ body }) => {
            expect(body).toHaveLength(3);
        });
});