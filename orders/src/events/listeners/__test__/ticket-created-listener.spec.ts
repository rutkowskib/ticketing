import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedEvent } from '@ruciuxd/common';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client);

    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { listener, data, message };
};

it('Creates and saves a ticket and acks message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);

    expect(message.ack).toHaveBeenCalled();
});

