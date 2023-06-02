import axios from 'axios';
import { API_URL } from './api';

const registerEmailInput = document.querySelector('#register-email');
const registerPasswordInput = document.querySelector('#register-password');
const loginEmailInput = document.querySelector('#login-email');
const loginPasswordInput = document.querySelector('#login-password');
const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
const logoutModal = document.querySelector('#logout-modal');
const loginModal = document.querySelector('#login-modal');
const registerModal = document.querySelector('#register-modal');
const logoutConfirmButton = document.querySelector('.btn-logout-confirm');

export let isLoggedIn = Boolean(localStorage.getItem('token'));
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

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
	event.preventDefault();

	const email = registerEmailInput.value;
	const password = registerPasswordInput.value;

	if (!emailRegex.test(email)) {
		alert('유효하지 않은 이메일 형식입니다.');
		return;
	}

	if (!passwordRegex.test(password)) {
		alert('최소 8자 이상이며, 숫자, 대문자, 소문자를 포함해야 합니다.');
		return;
	}

	let response;
	try {
		response = await axios.post(`${API_URL}/api/user/register`, {
			email,
			password,
		});
		console.log('response', response.text());
	} catch (error) {
		console.error(error);
		alert('회원가입에 실패했습니다. 이메일이나 비밀번호를 확인해주세요.');
		return;
	}

	if (response && response.data.success) {
		alert('회원가입에 성공했습니다!');
		loginEmailInput.value = '';
		loginPasswordInput.value = '';
		loginModal.style.display = 'block';
		registerModal.style.display = 'none';
	}
};

const handleLoginFormSubmit = async (event) => {
	event.preventDefault();

	const email = loginEmailInput.value;
	const password = loginPasswordInput.value;

	if (!emailRegex.test(email)) {
		alert('이메일이나 비밀번호를 확인해주세요.');
		return;
	}

	if (!passwordRegex.test(password)) {
		alert('이메일이나 비밀번호를 확인해주세요.');
		return;
	}

	let response;
	try {
		response = await axios.post(`${API_URL}/api/user/login`, {
			email,
			password,
		});
	} catch (error) {
		console.error(error);
		alert('이메일이나 비밀번호를 확인해주세요.');
		return;
	}

	if (response && response.status === 200) {
		console.log('로그인 성공!!', response);
		alert('로그인에 성공했습니다!');
		window.location.href = '/';
		localStorage.setItem('token', response.data.token);
		isLoggedIn = true;
		loginModal.style.display = 'none';
	}
};

registerForm.addEventListener('submit', handleRegisterFormSubmit);
loginForm.addEventListener('submit', handleLoginFormSubmit);
logoutConfirmButton.addEventListener('click', () => {
	localStorage.removeItem('token');
	logoutModal.style.display = 'none';
	console.log('로그아웃 성공!!');
	alert('로그아웃 성공!!');
	isLoggedIn = false;
	window.location.reload();
});

window.addEventListener('DOMContentLoaded', () => {
	displayLoginStatus();
});
