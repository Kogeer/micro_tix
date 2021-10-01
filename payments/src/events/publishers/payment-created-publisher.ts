import {PaymentCreatedEvent, Publisher, Subjects} from "@kogeertix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
