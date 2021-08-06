import {TicketUpdatedListener} from "../ticket-updated-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import mongoose from "mongoose";
import {TicketUpdatedEvent} from "@kogeertix/common";
import {Message} from "node-nats-streaming";

const setup = async () => {
    //create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    //create and save a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 10
    });
    await ticket.save();
    //create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'Updated concert',
        price: 99,
        userId: mongoose.Types.ObjectId().toHexString()
    };
    //create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    //return all of this
    return {listener, ticket, data, msg};
};

it('Find, update and saves a ticket', async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket.title).toEqual(data.title);
    expect(updatedTicket.price).toEqual(data.price);
    expect(updatedTicket.version).toEqual(data.version);
});

it('It acks the message', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('Does not call ack if the event has a skipped version number', async () => {
    const {listener, data, msg} = await setup();
    data.version = 10;

    await expect(listener.onMessage(data, msg)).rejects.toThrow();
    expect(msg.ack).not.toHaveBeenCalled();
});
