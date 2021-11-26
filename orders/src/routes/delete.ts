import express, { Request, Response } from 'express';
import { requireAuth, currentUser, NotFoundError, OrderStatus } from '@ruciuxd/common';
import { Order } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:id', currentUser, requireAuth, async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.user!.id) {
        throw new NotFoundError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    res.send(order);
});

export { router as deleteOrderRouter };
