import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {OrderCreatedEvent, OrderStatus} from "@kogeertix/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Order} from "../../../models/order";

const setup = () => {
    const listener =  new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'mock date',
        userId: 'mock ID',
        status: OrderStatus.Created,
        ticket: {
            id: 'mock ticket ID',
            price: 999
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener,data,msg};
}

it('Replicates the order info', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order.price).toEqual(data.ticket.price);
});

it('Acks the message', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
