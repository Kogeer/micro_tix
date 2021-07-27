import request from 'supertest';
import {Ticket} from "../../models/ticket";
import signin from "../../test/auth-helper";
import {app} from "../../app";
import {Order, OrderStatus} from "../../models/order";

it('Marks an order as cancelled', async () => {
    // Create a ticket with Ticket model
    const ticket = Ticket.build({
        title: 'concert',
        price: 123
    });
    await ticket.save();

    const user = signin();

    // Make a request to create an order
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // Make a request to cancel the order
    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    // Expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it.todo('Emits an order cancelled event');