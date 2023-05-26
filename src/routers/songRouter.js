import express from 'express';
import { addSong, removeSong, getSongs } from '../controllers/songController';
import { authenticateUser } from '../middlewares';

const songRouter = express.Router();

songRouter.get('/', authenticateUser, getSongs);
songRouter.post('/', authenticateUser, addSong);
songRouter.delete('/:id', authenticateUser, removeSong);

export default songRouter;
