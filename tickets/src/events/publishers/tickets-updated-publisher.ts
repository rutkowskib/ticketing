import { Publisher, Subjects, TicketUpdatedEvent } from '@ruciuxd/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;

}