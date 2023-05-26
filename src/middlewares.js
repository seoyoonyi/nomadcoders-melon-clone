import jwt from 'jsonwebtoken';
import { User } from './models/User';

export const localsMiddleware = (req, res, next) => {
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.siteName = 'Happy Music';
	res.locals.loggedInUser = req.session.user || {};
	next();
};

export const authenticateUser = async (req, res, next) => {
	const token = req.headers['x-access-token'] || req.headers['authorization'];
	if (!token) {
		res.status(401).json({ error: 'Access denied. No token provided.' });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);
		if (!user) throw new Error();
		req.user = user;
		next();
	} catch (error) {
		res.status(400).json({ error: 'Invalid token.' });
	}
};
