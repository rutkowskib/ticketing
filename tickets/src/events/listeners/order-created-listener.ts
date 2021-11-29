import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@ruciuxd/common';
import { QUEUE_GROUP_NAME } from './const';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/tickets-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = QUEUE_GROUP_NAME;

    async onMessage(data: OrderCreatedEvent["data"], message: Message): Promise<void>{
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set({ orderId: data.id });
        await ticket.save();

        new TicketUpdatedPublisher(this.)
        message.ack();
    }
}