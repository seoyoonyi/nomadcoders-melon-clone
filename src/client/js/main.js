//main.js
import '../scss/styles.scss';
import { addLikedSongs, getLikedSongs, removeLikedSongs } from './likedSongs';

import { getPopularSongs, getUserPlaylist, playSongFromPlaylist, player } from './play';
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
			<p class="song-title">${songTitle}</p>
		</div>
	
		<div class="button-box">
			<button id="play-button" class="btn play-button">
				<i class="fa fa-play"></i>
			</button>			
			<button id="heart-button" class="btn heart-button heart-${song.videoId}">
				<i class="fa fa-heart"></i>
			</button>
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

		heartChartButton.addEventListener('click', async () => {
			if (!isLoggedIn) {
				const loginModal = document.querySelector('#login-modal');
				loginModal.style.display = 'block';
				bringToFront('#login-modal');
			} else {
				try {
					heartChartButton.classList.add('heart-active');

					const response = await addLikedSongs({
						title: song.title,
						thumbnail: song.thumbnail,
						videoId: song.videoId,
						heartStatus: 'liked',
					});

					likedSongs.push(response);

					await getUserPlaylist();
				} catch (error) {
					console.error(error);
				}
			}
		});
	});
};

const renderMyPlaylist = async () => {
	const likedSongs = await getLikedSongs();

	if (!playlistContent) return;

	if (likedSongs.length === 0) {
		playlistContent.innerHTML =
			'<p class="playlist-empty">목록이 비어 있습니다.<br> 이 목록에 노래를 추가하려면 <i class="fa fa-heart"></i>버튼을 클릭하십시오.</p>';
		return;
	}

	playlistContent.innerHTML = '';

	likedSongs.forEach((song, index) => {
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
			<p class="song-title">${songTitle}</p>
		</div>

		<div class="button-box">
			<button id="play-button" class="btn play-button">
				<i class="fa fa-play"></i>
			</button>			
			<button id="heart-button" class="btn heart-button heart-${song.videoId}">
				<i class="fa fa-heart"></i>
			</button>
		</div>
    	`;
		li.setAttribute('data-video-id', song.videoId);
		playlistContent.appendChild(li);

		li.addEventListener('dblclick', (event) => {
			const videoId = event.currentTarget.getAttribute('data-video-id');
			if (videoId) {
				playSongFromPlaylist(`https://www.youtube.com/watch?v=${videoId}`, index);
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

		const heartChartButton = li.querySelector('.button-box .heart-button');
		const playChartButton = li.querySelector('.button-box .play-button');
		const songTitleText = li.querySelector('.song-box .song-title');

		if (song.heartStatus === 'liked') {
			heartChartButton.classList.add('heart-active');
		}

		playChartButton.addEventListener('click', () => {
			const videoId = li.getAttribute('data-video-id');
			if (videoId) {
				playSongFromPlaylist(`https://www.youtube.com/watch?v=${videoId}`, index);
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

		heartChartButton.addEventListener('click', async () => {
			if (!isLoggedIn) {
				const loginModal = document.querySelector('#login-modal');
				loginModal.style.display = 'block';
				bringToFront('#login-modal');
			} else {
				try {
					const existingSongs = await getLikedSongs();

					// 이미 좋아요한 곡인지 확인
					const isAlreadyLiked = existingSongs.some(
						(existingSong) =>
							existingSong.videoId === song.videoId &&
							existingSong.heartStatus === song.heartStatus,
					);
					// 이미 좋아요한 곡이라면 DB에서 해당 곡을 제거하고 함수 종료
					if (isAlreadyLiked) {
						const likedSong = existingSongs.find(
							(existingSong) =>
								existingSong.videoId === song.videoId &&
								existingSong.heartStatus === song.heartStatus,
						);
						if (likedSong && likedSong._id) {
							await removeLikedSongs(likedSong._id); // DB에서 제거
							songTitleText.classList.add('playlist-remove');
							heartChartButton.classList.remove('heart-active');
							alert('You have removed this song from your liked songs.');
							return;
						} else {
							throw new Error('The liked song does not have a valid id.');
						}
					}
				} catch (error) {
					console.error(error);
				}
			}
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
