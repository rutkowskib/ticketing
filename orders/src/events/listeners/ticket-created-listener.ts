import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from '@ruciuxd/common';
import { QUEUE_GROUP_NAME } from './const';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = QUEUE_GROUP_NAME;

    async onMessage(parsedMessage: TicketCreatedEvent["data"], message: Message): Promise<void>{
        const { id, title, price } = parsedMessage;
        const ticket = Ticket.build({
            title,
            price,
            id,
        });
        await ticket.save();

        message.ack()
    }
}