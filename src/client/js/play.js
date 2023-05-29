import axios from 'axios';
import { API_URL } from './api';
import { isLoggedIn } from './user';
import { bringToFront } from './main';

export let player;
let isPlaying = false;
let videoId;
let lastVideoId;

const audioPlayer = document.querySelector('#audio-player');
const playButton = document.querySelector('#play-button');
const pauseButton = document.querySelector('#pause-button');
const volumeSlider = document.querySelector('#volume-slider');
const progressContainer = document.querySelector('.audio-progress');
const progressBar = document.querySelector('.audio-progress-bar');
const backwardButton = document.querySelector('#backward-button');
const forwardButton = document.querySelector('#forward-button');

window.onYouTubeIframeAPIReady = () => {
	player = new YT.Player('player', {
		height: '0',
		width: '0',
		videoId,
		playerVars: {
			autoplay: 0,
			controls: 0,
			modestbranding: 1,
			playsinline: 1,
			enablejsapi: 1,
			disablekb: 1,
		},
		events: {
			onReady: (event) => {
				console.log('onReady', event.target);
				event.target.playVideo();
				event.target.mute();
			},
			onStateChange: onPlayerStateChange,
		},
	});
};

export const getPopularSongs = async () => {
	try {
		const response = await axios.get(`${API_URL}/api/chart`);

		return response;
	} catch (error) {
		console.log(error);
	}
};

const getVideoId = (url) => {
	const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com|\.be)\/(?:watch\?v=)?(.+)/);
	return match ? match[1] : null;
};

export const playSong = async (url) => {
	videoId = getVideoId(url);
	if (!videoId) return;

	if (player) {
		if (lastVideoId === videoId && player.getPlayerState() !== YT.PlayerState.ENDED) {
			player.playVideo();
			isPlaying = true; // 여기에 isPlaying을 true로 업데이트 해줍니다.
		} else {
			player.loadVideoById({
				videoId: videoId,
				startSeconds: 0,
			});
			player.playVideo();
			isPlaying = true; // 여기에 isPlaying을 true로 업데이트 해줍니다.
		}
	}
};

const onPlayerStateChange = (event) => {
	if (event.data === YT.PlayerState.PLAYING) {
		progressBar.max = player.getDuration();
		setInterval(() => updateProgressBar(player), 1000);
	}
	if (event.data === YT.PlayerState.ENDED) {
		lastVideoId = null;
	} else {
		lastVideoId = videoId;
	}
};

const updateProgressBar = (player) => {
	const currentTime = player.getCurrentTime();
	const duration = player.getDuration();
	const progressBarWidth = (currentTime / duration) * 100 + '%';
	progressBar.style.width = progressBarWidth;
};

export const setVolume = (volume) => {
	if (player) {
		if (volume <= 0) {
			player.setVolume(0);
			audioPlayer.volume = 0;
		} else if (volume >= 1) {
			player.setVolume(100);
			audioPlayer.volume = 1;
		} else {
			player.setVolume(volume * 100);
			audioPlayer.volume = volume;
		}
	}
};

export const playAudio = (url) => {
	audioPlayer.src = url;
	audioPlayer.play();
	isPlaying = true; // 재생을 시작하면서 isPlaying을 true로 설정합니다.
	pauseButton.classList.remove('hidden'); // 재생을 시작하면서 일시 중지 버튼을 보여줍니다.
	playButton.classList.add('hidden'); // 재생을 시작하면서 재생 버튼을 숨깁니다.
};

const pauseAudio = () => {
	if (!audioPlayer.paused) {
		audioPlayer.pause();
	}
	if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
		player.pauseVideo();
	}
	isPlaying = false; // 재생을 일시 중지하면서 isPlaying을 false로 설정합니다.
	playButton.classList.remove('hidden'); // 재생을 일시 중지하면서 재생 버튼을 보여줍니다.
	pauseButton.classList.add('hidden'); // 재생을 일시 중지하면서 일시 중지 버튼을 숨깁니다.
};

export const togglePlayback = () => {
	if (isPlaying) {
		pauseAudio();
	} else {
		if (lastVideoId === videoId && player.getPlayerState() !== YT.PlayerState.ENDED) {
			player.playVideo();
			player.unMute(); // 재생을 시작하면서 음소거를 해제합니다.
		} else {
			playSong(`https://www.youtube.com/watch?v=${videoId}`);
			player.unMute(); // 재생을 시작하면서 음소거를 해제합니다.
		}
		playAudio(audioPlayer.src);
	}
};

export const restartPlayback = () => {
	if (player) {
		const currentTime = player.getCurrentTime(); // 현재 재생 시간 가져오기
		player.loadVideoById({
			videoId: videoId,
			startSeconds: currentTime, // 현재 재생 시간으로 시작 시간 설정
		});
		player.unMute();
		player.playVideo();
		playAudio(audioPlayer.src);
	}
};

window.addEventListener('DOMContentLoaded', async () => {
	const popularSongs = await getPopularSongs();

	const firstSong = popularSongs.data[0];
	const { title, thumbnail, videoId } = firstSong;

	playSong(`https://www.youtube.com/watch?v=${videoId}`);

	const titleElement = document.querySelector('.audio-info-box .title');
	const thumbnailElement = document.querySelector('.audio-info-box .thumb-nail');

	const thumbnailImg = document.createElement('img');
	thumbnailElement.appendChild(thumbnailImg);

	titleElement.textContent = title;
	thumbnailImg.src = thumbnail;
});

window.addEventListener('DOMContentLoaded', () => {
	if (isPlaying) {
		pauseButton.classList.remove('hidden');
		playButton.classList.add('hidden');
	} else {
		pauseButton.classList.add('hidden');
		playButton.classList.remove('hidden');
	}
});

playButton.addEventListener('click', function () {
	restartPlayback();
});

pauseButton.addEventListener('click', () => {
	togglePlayback();
});

volumeSlider.addEventListener('input', () => {
	const volume = volumeSlider.value;
	setVolume(volume);
});

progressContainer.addEventListener('click', (event) => {
	const progressContainerWidth = progressContainer.offsetWidth;
	const clickedX = event.offsetX;
	const progressBarWidth = (clickedX / progressContainerWidth) * 100;
	const seekTime = (progressBarWidth / 100) * player.getDuration();
	player.seekTo(seekTime, true);
});

backwardButton.addEventListener('click', () => {
	if (!isLoggedIn) {
		alert('로그인 후 이용 가능합니다.');
		const loginModal = document.querySelector('#login-modal');
		loginModal.style.display = 'block';
		bringToFront('#login-modal');
	}
});

forwardButton.addEventListener('click', () => {
	if (!isLoggedIn) {
		alert('로그인 후 이용 가능합니다.');
		const loginModal = document.querySelector('#login-modal');
		loginModal.style.display = 'block';
		bringToFront('#login-modal');
	}
});
