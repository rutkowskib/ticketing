import request from 'supertest';
import { app } from '../../app';

it('Return a 201 on successfull signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.pl',
            password: 'testtest'
        })
        .expect(201);
});

it('Returns 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test',
            password: 'testtest'
        })
        .expect(400);
});

it('Returns 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@email.com',
            password: 'tet'
        })
        .expect(400);
});

it('Returns 400 when email and password are missing', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
});

it('Disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@email.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@email.com',
            password: 'password'
        })
        .expect(400);
});

it('Sets a cookie after successful signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@email.com',
            password: 'password'
        })
        .expect(201)
        .expect(({ headers }) => {
            expect(headers['set-cookie']).toBeDefined();
        });
});
