import { sign, verify } from 'jsonwebtoken';
import TokenStorage from './token';
import dotenv from 'dotenv';
dotenv.config();

const secretKeyName = process.env.VARIABLE_NAME;

export default class JWTAuth {
	constructor() {
		this.secretKey = secretKeyName;
		this.tokenStorage = new TokenStorage();
	}

	generateToken(user) {
		const payload = {
			userId: user._id, // 토큰에 담을 데이터
			userEmail: user.email,
		};
		const options = {
			expiresIn: '1h', // 토큰 만료 시간
			issuer: 'myIssuer', // 발급자
		};
		const token = sign(payload, this.secretKey, options); // 토큰 생성
		this.tokenStorage.saveToken(token); // 생성된 토큰 저장
		return token;
	}

	verifyToken(token) {
		try {
			const decoded = verify(token, this.secretKey); // 토큰 검증
			return decoded;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}
