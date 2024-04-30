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
			userId: user._id,
			userEmail: user.email,
		};
		const options = {
			expiresIn: '1h',
			issuer: 'myIssuer',
		};
		const token = sign(payload, this.secretKey, options);
		this.tokenStorage.saveToken(token);
		return token;
	}

	verifyToken(token, func) {
		try {
			const decoded = verify(token, this.secretKey, func); 
			return decoded;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}
