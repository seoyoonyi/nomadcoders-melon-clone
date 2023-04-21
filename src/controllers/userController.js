import { User } from '../models/User';
import dotenv from 'dotenv';
import JWTAuth from '../utils/jwt';
// import path from 'path';

dotenv.config();
const jwtAuth = new JWTAuth();

export const login = async (req, res) => {
	return res.render('login', { pageTitle: 'Log In' });
};

// export const goLogin = async (req, res) => {
// 	return res.sendFile(path.join(__dirname, '/views/login.pug'));
// };

export const register = async (req, res) => {
	return res.render('register', { pageTitle: 'Register' });
};

export const getAllUser = async (req, res) => {
	try {
		const users = await User.find();
		res.send(users);
	} catch (error) {
		console.error(error);
		res.status(500).send('서버 에러');
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

		res.cookie('token', token, { httpOnly: true }); // 쿠키에 토큰 저장
		res.redirect('/');
	} catch (error) {
		console.error(error);
		res.status(500).send('서버 에러');
	}
};

export const registerUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (user) {
			return res.status(409).json({ success: false });
		}

		await User.create({
			email,
			password,
		});
		res.status(201).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).send('서버 에러');
	}
};
