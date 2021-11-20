import express from 'express';
import { currentUser } from '@ruciuxd/common';
import { requireAuth } from '@ruciuxd/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
    res.send(req.user);
});

export { router as currentUserRouter };
