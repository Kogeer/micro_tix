import {connect, Message} from "node-nats-streaming";
import {randomBytes} from "crypto";

console.clear();

const stan = connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    })

    // this option for save event data secure if example db connection lost
    // and that is why we use acknowledgement mode manually
    // after save the event data to DB we must send back to NATS streaming server
    // we processed the event data everything is fine!
    const options = stan.subscriptionOptions()
        .setManualAckMode(true);
    // use qGroup if service scale up, and one listener instance got the event!!!
    const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group');

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
        }

        msg.ack(); // processed the event data everything is fine!
    });
});

// First close the connection!!!
process.on('SIGINT', () => stan.close()); // watching interrupt signals
process.on('SIGTERM', () => stan.close()); // watching terminal signals