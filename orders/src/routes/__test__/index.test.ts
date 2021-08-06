import request from 'supertest';
import {Ticket} from "../../models/ticket";
import signin from "../../test/auth-helper";
import {app} from "../../app";
import mongoose from "mongoose";

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 230
    });
    await ticket.save();

    return ticket;
}

it('Return list of orders for an particular user', async () => {
    // Create three tickets
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    // Create one order as User #1
    const user1 = signin();
    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ticketId: ticket1.id})
        .expect(201);

    // Create two order as User #2
    const user2 = signin();
    const {body: order1} = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ticketId: ticket2.id})
        .expect(201);
    const {body: order2} = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ticketId: ticket3.id})
        .expect(201);

    // Make request to get orders for User #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200);

    // Make sure we only got the orders for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order1.id);
    expect(response.body[1].id).toEqual(order2.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
