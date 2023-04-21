import express from 'express';
import {
	register,
	registerUser,
	login,
	loginUser,
	getAllUser,
	// goLogin,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/', getAllUser);
// userRouter.get('/', goLogin);
userRouter.get('/register', register);
userRouter.get('/login', login);

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

export default userRouter;
