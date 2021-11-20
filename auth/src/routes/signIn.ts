import express from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@ruciuxd/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
], validateRequest, async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError('Invalid credentials');
    }
    const passwordMatches = await Password.compare(existingUser.password, password);
    if (!passwordMatches) {
        throw new BadRequestError('Invalid credentials');
    }

    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
    }, process.env.JWT_KEY!);
    req.session = {
        jwt: userJwt,
    };
    res.send('Hi there');
});

export { router as signInRouter };
