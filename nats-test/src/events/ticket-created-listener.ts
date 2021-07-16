import {Message} from "node-nats-streaming";
import {Listener} from "./base-listener";
import {TicketCreatedEvent} from "./ticket-created-event";
import {Subjects} from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Put business logic here.', data);

        //after processed don't forget to send back, everything is ok!
        msg.ack();
    }
}