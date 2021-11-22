import express, { Request, Response } from 'express';
import { currentUser, requireAuth, validateRequest } from '@ruciuxd/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('/api/tickets', currentUser, requireAuth, [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price invalid')
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({ title, price, userId: req.user!.id });
    await ticket.save();
    res.sendStatus(201);
});

export { router as createTicketRouter };
