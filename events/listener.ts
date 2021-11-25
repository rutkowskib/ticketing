import nats, { Message } from 'node-nats-streaming';
import { Listener } from './events/listener';
import { randomBytes } from 'crypto';
import { Subjects } from './events/subjects';
import { TicketCreatedEvent } from './events/ticket-created-event';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222',
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

   new TicketCreatedListener(stan);
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(parsedMessage: TicketCreatedEvent['data'], message: Message) {
        console.log(parsedMessage, message);

        message.ack();
    }
}