import request from 'supertest';
import { app } from '../../app';

it('Fails when email that doesnt exist is supplied', async () => {
    await request(app)
        .post('/api/users/signIn')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400);
});

it('Return a 201 on successfull signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.pl',
            password: 'testtest',
        })
        .expect(201);

    return request(app)
        .post('/api/users/signIn')
        .send({
            email: 'test@test.pl',
            password: 'testtest',
        })
        .expect(200)
        .expect(({ headers }) => expect(headers['set-cookie']).toBeDefined());
});

