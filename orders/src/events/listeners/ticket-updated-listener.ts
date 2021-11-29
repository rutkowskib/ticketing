import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from '@ruciuxd/common';
import { QUEUE_GROUP_NAME } from './const';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener  extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = QUEUE_GROUP_NAME;

    async onMessage(data: TicketUpdatedEvent['data'], message: Message) {
        const ticket = await Ticket.findById(data.id);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();

        message.ack();
    }
}