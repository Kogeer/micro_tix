import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import signin from "../../test/auth-helper";
import {natsWrapper} from "../../nats-wrapper";

it('Returns a 404 if the provided id does not exist', async () => {
    const id = mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', signin())
        .send({
            title: 'Valid title',
            price: 40
        })
        .expect(404);
});

it('Returns a 401 if the user is not authenticated', async () => {
    const id = mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'Valid title',
            price: 40
        })
        .expect(401);
});

it('Returns a 401 if the user does not own the ticket', async () => {
    const createdTicketResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'Not owned ticket',
            price: 100
        });

    await request(app)
        .put(`/api/tickets/${createdTicketResponse.body.id}`)
        .set('Cookie', signin())
        .send({
            title: 'Valid title',
            price: 33
        })
        .expect(401);
});

it('Returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = signin();
    const createdTicketResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Valid created ticket',
            price: 100
        });

    await request(app)
        .put(`/api/tickets/${createdTicketResponse.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 33
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${createdTicketResponse.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Valid',
            price: -33
        })
        .expect(400);
});

it('Updates the ticket provided valid inputs', async () => {
    const cookie = signin();
    const createdTicketResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Valid created ticket',
            price: 100
        });

    await request(app)
        .put(`/api/tickets/${createdTicketResponse.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Updated ticket title',
            price: 300
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${createdTicketResponse.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual('Updated ticket title');
    expect(ticketResponse.body.price).toEqual(300);
});

it('Publishes an event', async () => {
    const cookie = signin();
    const createdTicketResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Valid created ticket',
            price: 100
        });

    await request(app)
        .put(`/api/tickets/${createdTicketResponse.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Updated ticket title',
            price: 300
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
