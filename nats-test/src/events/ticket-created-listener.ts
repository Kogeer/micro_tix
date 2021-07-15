import {Message} from "node-nats-streaming";
import {Listener} from "./base-listener";

export class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'payments-service';

    onMessage(data: any, msg: Message) {
        console.log('Put business logic here.', data);

        //after processed don't forget to send back, everything is ok!
        msg.ack();
    }
}