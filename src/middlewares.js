import { User } from './models/User';
import JWTAuth from './utils/jwt';

const jwtAuth = new JWTAuth();

export const localsMiddleware = (req, res, next) => {
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.siteName = 'Happy Music';
	res.locals.loggedInUser = req.session.user || {};
	next();
};

export const authenticateUser = async (req, res, next) => {
	let token = req.headers['authorization'];

	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}

	if (!token) {
		return res.status(403).send({ auth: false, message: 'No token provided.' });
	}

	try {
		const decoded = await new Promise((resolve, reject) => {
			jwtAuth.verifyToken(token, (err, decoded) => {
				if (err) {
					reject(err);
				} else {
					resolve(decoded);
				}
			});
		});

		req.userId = decoded.id;

		const user = await User.findById(decoded.userId);

		if (!user) throw new Error();
		req.user = user;
		next();
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(400).json({ error: 'Invalid token.' });
	}
};
