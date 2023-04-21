import express from 'express';
import path from 'path';

const viewsRouter = express.Router();

const serveStatic = (resource) => {
	const resourcePath = path.join(__dirname, `/src/views/${resource}`);
	const option = { index: `${resource}.pug` };

	return express.static(resourcePath, option);
};

viewsRouter.use('/', serveStatic('home'));
viewsRouter.use('/register', serveStatic('register'));
viewsRouter.use('/login', serveStatic('login'));

viewsRouter.use(
	express.static('public', {
		setHeaders: (res) => {
			res.set('Content-Type', 'text/css');
		},
	}),
);

export { viewsRouter };
