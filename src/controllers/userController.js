import { User } from '../models/User';
import dotenv from 'dotenv';
import JWTAuth from '../utils/jwt';

dotenv.config();
const jwtAuth = new JWTAuth();

export const getAllUser = async (req, res) => {
	try {
		const users = await User.find();
		res.send(users);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(500).json({ success: false, message: 'Server error', error: error.toString() });
	}
};

export const loginUser = async (req, res) => {
	const { email: userEmail, password: userPassword } = req.body;
	try {
		const foundUser = await User.findOne({ email: userEmail });
		if (!foundUser || foundUser.password !== userPassword) {
			res.status(401).send('이메일 또는 비밀번호가 잘못되었습니다.');
			return;
		}

		const token = jwtAuth.generateToken(foundUser); // 로그인 후 토큰 생성
		res.json({ userEmail, userPassword, token });
		// res.cookie('token', token, { httpOnly: true }); // 쿠키에 토큰 저장
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(500).json({ success: false, message: 'Server error', error: error.toString() });
	}
};

export const registerUser = async (req, res) => {
	const { email, password } = req.body;
	console.log('email', email);
	try {
		const user = await User.findOne({ email });

		if (user) {
			//중복 체크
			return res.status(409).json({ success: false, message: 'User already exists.' });
		}

		const newUser = await User.create({
			email,
			password,
		});
		if (!newUser) {
			return res.status(500).json({ success: false, message: 'Error creating user.' });
		}

		res.status(201).json({ success: true });
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(500).json({ success: false, message: 'Server error', error: error.toString() });
	}
};
