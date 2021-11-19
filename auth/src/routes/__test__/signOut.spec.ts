import request from 'supertest';
import { app } from '../../app';

it('Deletes cookie after signing out', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.pl',
            password: 'testtest',
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signIn')
        .send({
            email: 'test@test.pl',
            password: 'testtest',
        })
        .expect(200)
        .expect(({ headers }) => expect(headers['set-cookie']).toBeDefined());

    const cookies = response.get('set-cookie');

    await request(app)
        .post('/api/users/signOut')
        .set('Cookie', cookies)
        .expect(200)
        .expect(({ headers }) => {
            expect(headers['set-cookie'][0]).toEqual('express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
        });

});
