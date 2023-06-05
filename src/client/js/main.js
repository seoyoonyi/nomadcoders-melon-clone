//main.js
import '../scss/styles.scss';
import { addLikedSongs, getLikedSongs } from './likedSongs';

import { getPopularSongs, player } from './play';
import { playSong, togglePlayback } from './play';

import { isLoggedIn } from './user';

let zIndex = 1;
let likedSongs = [];

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
		<div class="song-box">
			<span class="rank">${chartRank[index]}</span>
			<div class="song-img-box">
				<img src="${song.thumbnail}" alt="${song.title}" width="120" height="90">
			</div>
			<p>${songTitle}</p>
		
			<div class="button-box">
				<button id="play-button" class="btn play-button">
					<i class="fa fa-play"></i>
				</button>			
				<button id="heart-button" class="btn heart-button">
					<i class="fa fa-heart"></i>
				</button>
			</div>
		</div>
		`;
		li.setAttribute('data-video-id', song.videoId);
		chartContent.appendChild(li);

		const heartChartButton = li.querySelector('.button-box .heart-button');
		const playChartButton = li.querySelector('.button-box .play-button');

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
			togglePlayback(); // 음악이 이미 재생 중이라면 이 함수가 일시 정지를 수행합니다.
			player.unMute();
			bringToFront('#player-modal');
		});

		playChartButton.addEventListener('click', () => {
			const videoId = li.getAttribute('data-video-id');
			if (videoId) {
				playSong(`https://www.youtube.com/watch?v=${videoId}`);
				togglePlayback();

				const thumbNailDiv = document.querySelector('.audio-info-box .thumb-nail');
				const titleDiv = document.querySelector('.audio-info-box .title');
				thumbNailDiv.innerHTML = `<img src="${song.thumbnail}" alt="${song.title}" width="120" height="90">`;
				titleDiv.textContent = songTitle;
			}
			togglePlayback(); // 음악이 이미 재생 중이라면 이 함수가 일시 정지를 수행합니다.
			player.unMute();
			bringToFront('#player-modal');
		});

		heartChartButton.addEventListener('click', async (event) => {
			if (!isLoggedIn) {
				const loginModal = document.querySelector('#login-modal');
				loginModal.style.display = 'block';
				bringToFront('#login-modal');
			} else {
				event.target.classList.toggle('heart-active');

				try {
					const response = await addLikedSongs({
						title: song.title,
						thumbnail: song.thumbnail,
						videoId: song.videoId,
						heartStatus: 'liked',
					});

					console.log('addLikedSongs', response);
					likedSongs.push(response);
				} catch (error) {
					console.error(error);
				}
			}
		});
	});
};

const renderMyPlaylist = async () => {
	const mySongs = await getLikedSongs();

	if (!playlistContent) return;
	playlistContent.innerHTML = '';

	mySongs.forEach((song, index) => {
		const li = document.createElement('li');

		let songTitle = song.title;
		if (songTitle.length > 38) {
			songTitle = songTitle.substring(0, 35) + '...';
		}
		li.innerHTML = `
			<div class="song-box">
				<span class="rank">${index + 1}</span>
				<div class="song-img-box">
					<img src="${song.thumbnail}" alt="${song.title}" width="120" height="90">
				</div>
				<p>${songTitle}</p>
			
				<div class="button-box">
					<button id="play-button" class="btn play-button">
						<i class="fa fa-play"></i>
					</button>
				</div>
			</div>
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

getLikedSongs().then((response) => {
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
		bringToFront(windowSelector);
	});
};

export const bringToFront = (windowSelector) => {
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

isLoggedIn
	? makeShowable('.menu li.playlist', '#playlist-modal')
	: makeShowable('.menu li.playlist', '#login-modal');

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

playlistMenu.addEventListener('click', async () => {
	if (!isLoggedIn) {
		// 사용자가 로그인하지 않았다면
		const loginModal = document.querySelector('#login-modal');
		loginModal.style.display = 'block'; // 로그인 모달창을 보여줍니다.
	} else {
		try {
			const response = await getLikedSongs();
			renderMyPlaylist(response.data);
		} catch (error) {
			console.error(error);
		}

		const playlistModal = document.querySelector('#playlist-modal');
		playlistModal.style.display = 'block'; // 로그인 모달창을 보여줍니다.
	}
});
