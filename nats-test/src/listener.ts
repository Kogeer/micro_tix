import {connect, Message} from "node-nats-streaming";
import {randomBytes} from "crypto";

console.clear();

const stan = connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    // use qGroup if service scale up, and only send one listener instance the event!!!
    const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group');

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
        }
    });
});