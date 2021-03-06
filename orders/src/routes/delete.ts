import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from "@kogeertix/common";
import {param} from "express-validator";
import mongoose from "mongoose";
import {Order, OrderStatus} from "../models/order";
import {OrderCancelledPublisher} from "../events/publishers/order-cancelled-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

// We not really delete just update the status that is why patch
router.patch(
    '/api/orders/:orderId',
    requireAuth,
    [
        param('orderId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('TicketId must be provided and valid mongo id')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {orderId} = req.params;
        const order = await Order.findById(orderId).populate('ticket');

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser.id) {
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {id: order.ticket.id},
            version: order.version
        });

        res.status(204).send(order);
    });

export {router as deleteOrderRouter};
