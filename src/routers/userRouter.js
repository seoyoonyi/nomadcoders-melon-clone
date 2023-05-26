import express from 'express';
import { registerUser, loginUser, getAllUser } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/', getAllUser);

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

export default userRouter;
