import request from 'supertest';
import { app } from '../../app';

it('Responds with details about current user', async () => {
    const cookies = await signin();

    await request(app)
        .get('/api/users/currentUser')
        .set('Cookie', cookies)
        .expect(200)
        .expect(({ body }) => {
            expect(body.email).toEqual('test@test.pl');
        });
});

it('Responds with unauthorized if not authenticated', async () => {
    await request(app)
        .get('/api/users/currentUser')
        .expect(401);
});
