import express from 'express';
import { registerUser } from '../controllers/userController';

const registerUpRouter = express.Router();

registerUpRouter.post('/', registerUser);

export default registerUpRouter;
