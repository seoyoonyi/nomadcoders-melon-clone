import axios from 'axios';
import { API_URL } from './api';

const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
const logoutModal = document.querySelector('#logout-modal');
const loginModal = document.querySelector('#login-modal');
const logoutConfirmButton = document.querySelector('.btn-logout-confirm');

export let isLoggedIn = Boolean(localStorage.getItem('token'));

const sendPostRequest = async (url, data) => {
	try {
		const response = await axios.post(`${API_URL}${url}`, data);
		return response;
	} catch (error) {
		console.error(error);
		alert(`${url} 요청 중 에러가 발생했습니다.`);
	}
};

const displayLoginStatus = () => {
	const headerTitle = document.querySelector('#player-modal-header h1');
	const emailElement = document.createElement('span');
	headerTitle.appendChild(emailElement);

	const token = localStorage.getItem('token');
	if (token) {
		emailElement.textContent = ' - Logged in';
	} else {
		emailElement.textContent = '';
	}
};

const handleRegisterFormSubmit = async (event) => {
	event.preventDefault(); // 폼 제출 막기

	const email = emailInput.value;
	const password = passwordInput.value;

	const response = await sendPostRequest('/api/user/register', {
		email,
		password,
	});

	if (response && response.data.success) {
		loginModal.style.display = 'block';
	}
};

const handleLoginFormSubmit = async (event) => {
	event.preventDefault(); // 폼 제출 막기

	const email = emailInput.value;
	const password = passwordInput.value;

	const response = await sendPostRequest('/api/user/login', {
		email,
		password,
	});

	// 로그인 성공 시 메인 페이지로 리다이렉트
	if (response && response.status === 200) {
		console.log('로그인 성공!!', response);
		// 메인 페이지로 리다이렉트
		window.location.href = '/';
		// 로그인 성공 시 토큰을 Local Storage에 저장
		localStorage.setItem('token', response.data.token);
		isLoggedIn = true;
	}
};

registerForm.addEventListener('submit', handleRegisterFormSubmit);
loginForm.addEventListener('submit', handleLoginFormSubmit);
logoutConfirmButton.addEventListener('click', () => {
	localStorage.removeItem('token');
	logoutModal.style.display = 'none';
	console.log('로그아웃 성공!!');
	// 로그아웃 후 새로고침을 통해 이메일 표시를 제거합니다.
	isLoggedIn = false;
	window.location.reload();
});

window.addEventListener('DOMContentLoaded', () => {
	displayLoginStatus();
});
