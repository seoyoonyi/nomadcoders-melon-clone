import express from 'express';
import { authenticateUser } from '../middlewares';
import { addLikedSongs, getLikedSongs, removeLikedSongs } from '../controllers/likedsongController';

const likedSongRouter = express.Router();

likedSongRouter.get('/', authenticateUser, getLikedSongs);
likedSongRouter.post('/', authenticateUser, addLikedSongs);
likedSongRouter.delete('/:id', authenticateUser, removeLikedSongs);

export default likedSongRouter;
