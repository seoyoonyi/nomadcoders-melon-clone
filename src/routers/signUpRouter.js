import express from 'express';
import { signup } from '../controllers/userController';

const signUpRouter = express.Router();

signUpRouter.get('/', signup);

export default signUpRouter;
