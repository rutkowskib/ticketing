import { ExpirationCompleteEvent, Publisher, Subjects } from '@ruciuxd/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

}