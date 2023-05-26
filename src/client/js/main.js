//main.js
import '../scss/styles.scss';

import { getPopularSongs } from './play';
import { playSong, togglePlayback } from './play';
import { addSong, getSongs } from './song';
import { isLoggedIn } from './user';

let zIndex = 1;

const chartContent = document.querySelector('.chart-content');
const playlistContent = document.querySelector('.playlist-content');
const playlistMenu = document.querySelector('.menu li.playlist');

const renderSongs = (songs) => {
	if (!chartContent) return;
	chartContent.innerHTML = '';

	let numbers = Array.from({ length: 10 }, (_, i) => i + 1);

	let chartRank = numbers.map((number) => {
		return String(number).padStart(2, '0');
	});

	songs.forEach((song, index) => {
		const li = document.createElement('li');

		let songTitle = song.title;
		if (songTitle.length > 38) {
			songTitle = songTitle.substring(0, 35) + '...';
		}

		li.innerHTML = `
			<span>${chartRank[index]}</span>
			<div>
				<img src="${song.thumbnail}" alt="${song.title}" width="120" height="90">
			</div>
			<p>${songTitle}</p>
			<button id="heart-button" class="btn">
				<i class="fa fa-heart"></i>
			</button>
		
		`;
		li.setAttribute('data-video-id', song.videoId);
		chartContent.appendChild(li);

		const heartButton = document.querySelector('#heart-button');
		heartButton.addEventListener('click', () => {
			if (!isLoggedIn) {
				// 사용자가 로그인하지 않았다면
				const loginModal = document.querySelector('#login-modal');
				loginModal.style.display = 'block'; // 로그인 모달창을 보여줍니다.
			} else {
				// 찜한 곡 추가
				addSong({
					title: songTitle,
					thumbnail: song.thumbnail,
					videoId: song.videoId,
				});
			}
		});

		li.addEventListener('dblclick', (event) => {
			const videoId = event.currentTarget.getAttribute('data-video-id');
			if (videoId) {
				playSong(`https://www.youtube.com/watch?v=${videoId}`);
				togglePlayback();

				const thumbNailDiv = document.querySelector('.audio-info-box .thumb-nail');
				const titleDiv = document.querySelector('.audio-info-box .title');
				thumbNailDiv.innerHTML = `<img src="${song.thumbnail}" alt="${song.title}" width="120" height="90">`;
				titleDiv.textContent = songTitle;
			}
			bringToFront('#player-modal');
		});
	});
};

const renderMyPlaylist = async () => {
	const mySongs = await getSongs();

	if (!playlistContent) return;
	playlistContent.innerHTML = '';

	mySongs.forEach((song, index) => {
		const li = document.createElement('li');

		let songTitle = song.title;
		if (songTitle.length > 38) {
			songTitle = songTitle.substring(0, 35) + '...';
		}
		li.innerHTML = `
			<span>${index + 1}</span>
			<div>
				<img src="${song.thumbnail}" alt="${song.title}">
			</div>
			<p>${songTitle}</p>
    	`;
		li.setAttribute('data-video-id', song.videoId);
		playlistContent.appendChild(li);

		li.addEventListener('dblclick', (event) => {
			const videoId = event.currentTarget.getAttribute('data-video-id');
			if (videoId) {
				playSong(`https://www.youtube.com/watch?v=${videoId}`);
				togglePlayback();

				const thumbNailDiv = document.querySelector('.audio-info-box .thumb-nail');
				const titleDiv = document.querySelector('.audio-info-box .title');
				thumbNailDiv.innerHTML = `<img src="${song.thumbnail}" alt="${song.title}" width="120" height="90">`;
				titleDiv.textContent = songTitle;
			}

			bringToFront('#playlist-modal');
		});
	});
};

getPopularSongs().then((response) => {
	renderSongs(response.data);
});

getSongs().then((response) => {
	renderMyPlaylist(response.data);
});

const makeClosable = (closeButtonSelector, windowSelector) => {
	const closeButton = document.querySelector(closeButtonSelector);
	const window = document.querySelector(windowSelector);

	closeButton.addEventListener('click', () => {
		window.style.display = 'none';
	});
};

export const makeShowable = (showButtonSelector, windowSelector) => {
	const showButton = document.querySelector(showButtonSelector);
	const window = document.querySelector(windowSelector);

	showButton.addEventListener('click', () => {
		window.style.display = 'block';
	});
};

const bringToFront = (windowSelector) => {
	const window = document.querySelector(windowSelector);
	window.style.zIndex = ++zIndex;
};

const makeDraggable = (windowHeaderSelector, windowSelector) => {
	let offset = [0, 0];
	let mouseDown = false;

	const windowHeader = document.querySelector(windowHeaderSelector);
	const window = document.querySelector(windowSelector);

	windowHeader.addEventListener('mousedown', (e) => {
		mouseDown = true;
		offset = [window.offsetLeft - e.clientX, window.offsetTop - e.clientY];
	});

	window.addEventListener('mousedown', () => {
		bringToFront(windowSelector);
	});

	document.addEventListener('mouseup', () => {
		mouseDown = false;
	});

	document.addEventListener('mousemove', (e) => {
		e.preventDefault();
		if (mouseDown) {
			window.style.left = e.clientX + offset[0] + 'px';
			window.style.top = e.clientY + offset[1] + 'px';
		}
	});
};

makeShowable('.icon-box.music', '#player-modal');
makeShowable('.menu li.chart', '#chart-modal');
makeShowable('.btn-open-login', '#login-modal');
makeShowable('.btn-open-register', '#register-modal');
isLoggedIn
	? makeShowable('.icon-box.user', '#logout-modal')
	: makeShowable('.icon-box.user', '#login-modal');
// makeShowable('.menu li.playlist', '#playlist-modal');

makeClosable('#player-modal-close', '#player-modal');
makeClosable('#chart-modal-close', '#chart-modal');
makeClosable('#login-modal-close', '#login-modal');
makeClosable('#register-modal-close', '#register-modal');
makeClosable('#logout-modal-close', '#logout-modal');
makeClosable('#playlist-modal-close', '#playlist-modal');

makeDraggable('#player-modal-header', '#player-modal');
makeDraggable('#chart-modal-header', '#chart-modal');
makeDraggable('#login-modal-header', '#login-modal');
makeDraggable('#register-modal-header', '#register-modal');
makeDraggable('#logout-modal-header', '#logout-modal');
makeDraggable('#playlist-modal-header', '#playlist-modal');

playlistMenu.addEventListener('click', () => {
	if (!isLoggedIn) {
		// 사용자가 로그인하지 않았다면
		const loginModal = document.querySelector('#login-modal');
		loginModal.style.display = 'block'; // 로그인 모달창을 보여줍니다.
	} else {
		const playlistModal = document.querySelector('#playlist-modal');
		playlistModal.style.display = 'block'; // 로그인 모달창을 보여줍니다.
	}
});
