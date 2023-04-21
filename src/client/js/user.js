import axios from 'axios';
import { apiUrl } from './api';

const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const registerForm = document.querySelector('#register-form');

const handleFormSubmit = async (event) => {
	event.preventDefault(); // 폼 제출 막기

	const email = emailInput.value;
	const password = passwordInput.value;

	try {
		const response = await axios.post(`${apiUrl}/api/user/register`, {
			email,
			password,
		});

		if (response.data.success) {
			window.location.href = '/login';
		}

		return await response.data;
	} catch (error) {
		console.error(error);
		alert('회원가입 중 에러가 발생했습니다.');
	}
};

registerForm.addEventListener('submit', handleFormSubmit);
