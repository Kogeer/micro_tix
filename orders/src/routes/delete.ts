import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from "@kogeertix/common";
import {param} from "express-validator";
import mongoose from "mongoose";
import {Order, OrderStatus} from "../models/order";

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
        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser.id) {
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        // TODO: publishing an event saying this was cancelled!

        res.status(204).send(order);
    });

export {router as deleteOrderRouter};
