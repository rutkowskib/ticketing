import { PaymentCreatedEvent, Publisher, Subjects } from '@ruciuxd/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}