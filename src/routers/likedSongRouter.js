import express from 'express';
import { authenticateUser } from '../middlewares';
import { addSongs, getSongs, removeSongs } from '../controllers/likedSongController';

const likedSongRouter = express.Router();

likedSongRouter.get('/', authenticateUser, getSongs);
likedSongRouter.post('/', authenticateUser, addSongs);
likedSongRouter.delete('/:id', authenticateUser, removeSongs);

export default likedSongRouter;
