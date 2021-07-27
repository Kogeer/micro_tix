import request from 'supertest';
import {Ticket} from "../../models/ticket";
import signin from "../../test/auth-helper";
import {app} from "../../app";

it('Fetches the order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 333
    });
    await ticket.save();
    const user = signin();

    // Make a request to build an order with this ticket
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // Make a request to fetch the order
    const {body: fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it('Returns an error if one user tries to fetch another user order', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 333
    });
    await ticket.save();
    const user = signin();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', signin())
        .send()
        .expect(401);
});
