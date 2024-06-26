import axios from 'axios';
import { API_URL } from './api';
import { author } from './likedSongs';

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
const registerButton = document.querySelector('#register-button');
const loginButton = document.querySelector('#login-button');
const registerSpinner = registerButton.querySelector('.spinner');
const loginSpinner = loginButton.querySelector('.spinner');

let isSubmitting = false;
export let isLoggedIn = Boolean(localStorage.getItem('token'));
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

let alertShown = false;

author.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 400) {
			if (!alertShown && isLoggedIn) {
				alert('세션 유효기간이 만료되었습니다. 다시 로그인해 주세요.');
				alertShown = true;

				const loginModal = document.querySelector('#login-modal');
				loginModal.style.display = 'block';
			}

			localStorage.removeItem('token');
			isLoggedIn = false;

			const loginStatus = document.querySelector('.login-status');
			loginStatus.textContent = '';
		}
		throw error;
	},
);

const updateSpinnerStatus = () => {
	if (isSubmitting) {
		registerSpinner.hidden = false;
		loginSpinner.hidden = false;
	} else {
		registerSpinner.hidden = true;
		loginSpinner.hidden = true;
	}
};

const updateSubmittingStatus = (newStatus) => {
	isSubmitting = newStatus;
	updateSpinnerStatus();
};

export const displayLoginStatus = () => {
	const headerTitle = document.querySelector('#player-modal-header h1');
	const loginStatus = document.createElement('span');
	loginStatus.classList.add('login-status');
	headerTitle.appendChild(loginStatus);

	const token = localStorage.getItem('token');
	if (token) {
		loginStatus.textContent = ' - Logged in';
	} else {
		loginStatus.textContent = '';
	}
};

const handleRegisterFormSubmit = async (event) => {
	event.preventDefault();

	if (isSubmitting) return;

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
		updateSubmittingStatus(true);
		response = await axios.post(`${API_URL}/api/user/register`, {
			email,
			password,
		});
	} catch (error) {
		updateSubmittingStatus(false);
		console.error(error);
		if (error.response.status === 409) {
			alert(error.response.data.message);
			return;
		}
		alert('회원가입에 실패했습니다. 이메일이나 비밀번호를 확인해주세요.');
		return;
	}

	if (response && response.data.success) {
		updateSubmittingStatus(false);
		alert('회원가입에 성공했습니다!');
		loginEmailInput.value = '';
		loginPasswordInput.value = '';
		loginModal.style.display = 'block';
		registerModal.style.display = 'none';
	}
};

const handleLoginFormSubmit = async (event) => {
	event.preventDefault();

	if (isSubmitting) return;

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
		updateSubmittingStatus(true);
		response = await axios.post(`${API_URL}/api/user/login`, {
			email,
			password,
		});
	} catch (error) {
		updateSubmittingStatus(false);
		console.error(error);
		alert('이메일이나 비밀번호를 확인해주세요.');
		return;
	}

	if (response && response.status === 200) {
		updateSubmittingStatus(false);

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

	isLoggedIn = false;
	window.location.reload();
});

window.addEventListener('DOMContentLoaded', () => {
	displayLoginStatus();
	updateSpinnerStatus();
});
