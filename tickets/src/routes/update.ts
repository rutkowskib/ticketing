import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import {
    BadRequestError,
    currentUser,
    NotFoundError,
    requireAuth,
    UnauthorizedError,
    validateRequest
} from '@ruciuxd/common';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers/tickets-updated-publisher';

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

    if (ticket.orderId) {
        throw new BadRequestError('Ticket is reserved');
    }

    if (ticket.userId !== req.user!.id) {
        throw new UnauthorizedError();
    }
    ticket.set({
        title: req.body.title,
        price: req.body.price,
    });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        version: ticket.version,
        userId: ticket.userId,
    });
    res.send(ticket);
});

export { router as updateTicketResponse };
