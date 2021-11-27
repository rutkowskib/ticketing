import { OrderCancelledEvent, Publisher, Subjects } from '@ruciuxd/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}