import express from 'express';
import passport from 'passport';
import { register, login } from './jwtAuth.js';

const { Router } = express;
const authRouter = Router()

export default authRouter;

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
    return res.status(200).json({message: 'JWT funcionando', userId: req.user.id})
})

