import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose  from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: MongoMemoryServer;

declare global {
    var signin: () => string[];
}

beforeAll(async () => {
    process.env.JWT_KEY = 'secret';
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

global.signin = (): string[] => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const sessionsJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionsJSON).toString('base64');

    return [ `express:sess=${base64}` ];
};
