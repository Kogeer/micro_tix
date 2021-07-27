import {OrderCancelledEvent, Publisher, Subjects} from "@kogeertix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
