import express, { Request, Response } from 'express';
import { currentUser, requireAuth } from '@ruciuxd/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', currentUser, requireAuth, async (req: Request, res: Response) => {
    const { id } = req.user!;
    const orders = await Order.find({ userId: id }).populate('ticket');
    res.send(orders);
});

export { router as indexOrderRouter };
