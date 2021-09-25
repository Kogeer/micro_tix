import {Listener, OrderCreatedEvent, Subjects} from "@kogeertix/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import {expirationQueue} from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
        await expirationQueue.add({orderId: data.id});

        msg.ack();
    }


}