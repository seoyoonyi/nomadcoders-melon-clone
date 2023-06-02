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

	if (!email || !password) {
		return res
			.status(400)
			.json({ success: false, message: '이메일 또는 비밀번호가 누락됬습니다.' });
	}

	const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
	const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

	if (!emailRegex.test(email)) {
		return res.status(400).json({ success: false, message: '유효하지 않은 이메일 형식입니다.' });
	}

	if (!passwordRegex.test(password)) {
		return res.status(400).json({
			success: false,
			message: '최소 8자 이상이며, 숫자, 대문자, 소문자를 포함해야 합니다.',
		});
	}

	try {
		const user = await User.findOne({ email });

		if (user) {
			//중복 체크
			return res.status(409).json({ success: false, message: '이미 가입된 회원입니다.' });
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
