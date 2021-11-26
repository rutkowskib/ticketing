import express, { Request, Response } from 'express';
import { currentUser, requireAuth, validateRequest } from '@ruciuxd/common';
import { body } from 'express-validator';

const router = express.Router();

router.post('/api/orders', currentUser, requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .withMessage('TicketId must be provider')
], validateRequest, async (req: Request, res: Response) => {
    res.send({});
});

export { router as newOrderRouter };
