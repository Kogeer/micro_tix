import {connect} from 'node-nats-streaming';

console.clear();

// args: cluster id, client id, and the url of nats client
const stan = connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
}); //connect to nats server

//create a connect event
stan.on('connect', () => {
    console.log('Publisher connected to NATS');

    // never send simple object as data!
    const data = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    });

    // args: subject, data, callback
    stan.publish('ticket:created', data, () => {
        console.log('Ticket created event published');
    })
});