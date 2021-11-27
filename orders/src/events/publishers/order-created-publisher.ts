import { OrderCreatedEvent, Publisher, Subjects } from '@ruciuxd/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}