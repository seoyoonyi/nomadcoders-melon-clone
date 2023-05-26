import axios from 'axios';
import { API_URL } from './api';

let player;
let isPlaying = false;
let videoId;
let lastVideoId;

const audioPlayer = document.querySelector('#audio-player');
const playButton = document.querySelector('#play-button');
const pauseButton = document.querySelector('#pause-button');
const volumeSlider = document.querySelector('#volume-slider');
const progressContainer = document.querySelector('.audio-progress');
const progressBar = document.querySelector('.audio-progress-bar');

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
		} else {
			player.loadVideoById({
				videoId: videoId,
				startSeconds: 0,
			});
			player.playVideo();
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

export const togglePlayback = () => {
	if (isPlaying) {
		pauseButton.classList.add('hidden');
		playButton.classList.remove('hidden');
		pauseAudio();
	} else {
		playButton.classList.add('hidden');
		pauseButton.classList.remove('hidden');
		if (lastVideoId === videoId && player.getPlayerState() !== YT.PlayerState.ENDED) {
			player.playVideo();
		} else {
			playSong(`https://www.youtube.com/watch?v=${videoId}`);
		}
	}
	isPlaying = !isPlaying;
};

const pauseAudio = () => {
	if (!audioPlayer.paused) {
		audioPlayer.pause();
	}
	if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
		player.pauseVideo();
	}
};

export const playAudio = (url) => {
	audioPlayer.src = url;
	audioPlayer.play();
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
		togglePlayback();
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
