import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@ruciuxd/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payments';

it('Returns 404 if order doesnt exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: '123456',
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it('Returns 401 when purchasing order that doesnt belong to user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: '123456',
            orderId: order.id,
        })
        .expect(401);
});

it('Returns 4000 when purchasing cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 10,
        status: OrderStatus.Cancelled,
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: '123456',
            orderId: order.id,
        })
        .expect(400);
});

it('Returns 204 with valid input', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id,
        })
        .expect(201);

    const charges = await stripe.charges.list({ limit: 10 });
    const charge = charges.data.find((charge) => charge.amount = price * 100);
    expect(charge).toBeDefined();
    expect(charge!.amount).toEqual(price * 100);
    expect(charge!.currency).toEqual('usd');

    const payments = await Payment.findOne({
        orderId: order.id,
        stripeId: charge!.id,
    });
    expect(payments).not.toBeNull();
});
