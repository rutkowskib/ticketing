import { Publisher, Subjects, TicketCreatedEvent } from '@ruciuxd/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;

}