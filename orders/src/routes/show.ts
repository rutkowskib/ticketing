import express, { Request, Response } from 'express';
import { currentUser, NotFoundError, requireAuth } from '@ruciuxd/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:id', currentUser, requireAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.user!.id) {
        throw new NotFoundError();
    }
    res.send({});
});

export { router as showOrderRouter };
