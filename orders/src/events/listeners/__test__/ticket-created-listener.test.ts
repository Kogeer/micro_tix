import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {TicketCreatedEvent} from "@kogeertix/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";

const setup = async () => {
    //create an instance of listener
    const listener = new TicketCreatedListener(natsWrapper.client);
    //create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 10,
        userId: mongoose.Types.ObjectId().toHexString()
    }
    //create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, data, msg};
};

it('Creates and save a ticket', async () => {
    const {listener, data, msg} = await setup();
    //call the on message function with the data object + message object
    await listener.onMessage(data, msg);
    //write assertion to make sure the ticket was created!
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket.title).toEqual(data.title);
    expect(ticket.price).toEqual(data.price);
});

it('Acks the message', async () => {
    const {listener, data, msg} = await setup();
    //call the on message function with the data object + message object
    await listener.onMessage(data, msg);
    //write assertion to make sure the acks function is called!
    expect(msg.ack).toHaveBeenCalled();
});
