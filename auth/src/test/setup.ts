import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose  from 'mongoose';
import { app } from '../app';
import request from 'supertest';

let mongo: MongoMemoryServer;

declare global {
    var signin: () => Promise<string[]>;
}

beforeAll(async () => {
    process.env.JWT_KEY = 'xd';
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});

global.signin = async (): Promise<string[]> => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.pl',
            password: 'testtest',
        })
        .expect(201);

    return response.get('set-cookie') as unknown as string[];
};
