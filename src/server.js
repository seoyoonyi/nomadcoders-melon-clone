import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import flash from 'express-flash';
import MongoStore from 'connect-mongo';
import { localsMiddleware } from './middlewares';
import rootRouter from './routers/rootRouter';
import chartRouter from './routers/chartRouter';
import userRouter from './routers/userRouter';
import { viewsRouter } from './routers/viewRouter';
import likedSongRouter from './routers/likedSongRouter';

const app = express();
const logger = morgan('dev');
const corsOptions = {
	origin: ['https://happyhappymusic.netlify.app', 'http://localhost:4000'],
};

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');

app.use(cors(corsOptions));
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		store: MongoStore.create({
			mongoUrl: process.env.DB_URL,
		}),
	}),
);

app.use(flash());
app.use(localsMiddleware);

app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static('assets'));

app.use('/', rootRouter);

app.use('/api/chart', chartRouter);
app.use('/api/user', userRouter);
app.use('/api/user/liked-song', likedSongRouter);

app.use('/', viewsRouter);

export default app;
