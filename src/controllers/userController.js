import mongoose from 'mongoose';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

export const signup = async (req, res) => {
	return res.render('signup', { pageTitle: 'Sign Up' });
};

export const registerUser = async (email, password) => {
	if (mongoose.connection.readyState !== 1) {
		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		});
	}

	const user = new User({ email, password });
	await user.save();
	return user;
};
