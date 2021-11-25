import { Publisher } from './events/publisher';
import { TicketCreatedEvent } from './events/ticket-created-event';
import { Subjects } from './events/subjects';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects = Subjects.TicketCreated;
}