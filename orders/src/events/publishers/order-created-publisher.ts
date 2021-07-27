import {OrderCreatedEvent, Publisher, Subjects} from "@kogeertix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
