import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { currentUser, NotFoundError, requireAuth, UnauthorizedError, validateRequest } from '@ruciuxd/common';
import { body } from 'express-validator';

const router = express.Router();

router.put('/api/tickets/:id', currentUser, requireAuth, [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price invalid')
], validateRequest, async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
        throw new NotFoundError();
    }
    if (ticket.userId !== req.user!.id) {
        throw new UnauthorizedError();
    }
    ticket.set({
        title: req.body.title,
        price: req.body.price,
    });
    await ticket.save();
    res.send(ticket);
});

export { router as updateTicketResponse };
