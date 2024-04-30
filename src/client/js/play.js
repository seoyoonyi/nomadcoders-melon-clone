import axios from 'axios';
import { API_URL } from './api';
import { getLikedSongs } from './likedSongs';

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
				event.target.playVideo();
				event.target.mute();
			},
			onStateChange: onPlayerStateChange,
		},
	});
};

let popularSongsList = [];  
let currentSongIndex = 0;
let playlistSongsList = []; 
let isPlaylistMode = false; 

export const getPopularSongs = async () => {
	try {
		const response = await axios.get(`${API_URL}/api/chart`);
		popularSongsList = response.data;
		currentSongIndex = 1;
		isPlaylistMode = false;
		return response;
	} catch (error) {
		console.error(error);
	}
};

export const getUserPlaylist = async () => {
	try {
		const response = await getLikedSongs();
		playlistSongsList = response;
		isPlaylistMode = true;
	} catch (error) {
		console.error(error);
	}
};

export const playSongFromPlaylist = async (url, index) => {
	pauseButton.classList.remove('hidden');
	playButton.classList.add('hidden');
	await getUserPlaylist();
	currentSongIndex = index;
	await playSong(url);
};

const updatePlayerUI = (title, thumbnail) => {
	const titleElement = document.querySelector('.audio-info-box .title');
	const thumbnailElement = document.querySelector('.audio-info-box .thumb-nail');

	titleElement.textContent = title;

	const thumbnailImg = thumbnailElement.querySelector('img') || document.createElement('img');
	thumbnailImg.src = thumbnail;
	thumbnailElement.appendChild(thumbnailImg);
};

const playNextSong = () => {
	let songList = isPlaylistMode ? playlistSongsList : popularSongsList;

	if (currentSongIndex < songList.length - 1) {
		currentSongIndex++;
		const nextSong = songList[currentSongIndex];
		if (nextSong.videoId) {
			updatePlayerUI(nextSong.title, nextSong.thumbnail);
			playSong(`https://www.youtube.com/watch?v=${nextSong.videoId}`);
		} else {
			alert('다음 곡 정보가 올바르지 않습니다.');
		}
	} else {
		alert('플레이리스트의 마지막 곡입니다.');
	}
};

const playPreviousSong = () => {
	let songList = isPlaylistMode ? playlistSongsList : popularSongsList;

	if (currentSongIndex > 0) {
		currentSongIndex--;
		const prevSong = songList[currentSongIndex];
		if (prevSong.videoId) {
			updatePlayerUI(prevSong.title, prevSong.thumbnail);
			playSong(`https://www.youtube.com/watch?v=${prevSong.videoId}`);
		} else {
			alert('이전 곡 정보가 올바르지 않습니다.');
		}
	} else {
		alert('첫 곡입니다.');
	}
};

const onPlayerStateChange = (event) => {
	if (event.data === YT.PlayerState.PLAYING) {
		progressBar.max = player.get;
		progressBar.max = player.getDuration();
		setInterval(() => updateProgressBar(player), 1000);
	}
	if (event.data === YT.PlayerState.ENDED) {
		playNextSong(); 
		lastVideoId = null;
	} else {
		lastVideoId = videoId;
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
			isPlaying = true;
		} else {
			player.loadVideoById({
				videoId: videoId,
				startSeconds: 0,
			});
			player.playVideo();
			isPlaying = true; 
		}
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
	isPlaying = true;
	pauseButton.classList.remove('hidden');
	playButton.classList.add('hidden');
};

const pauseAudio = () => {
	if (!audioPlayer.paused) {
		audioPlayer.pause();
	}
	if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
		player.pauseVideo();
	}
	isPlaying = false;
	playButton.classList.remove('hidden');
	pauseButton.classList.add('hidden');
};

export const togglePlayback = () => {
	if (isPlaying) {
		pauseAudio();
	} else {
		if (lastVideoId === videoId && player.getPlayerState() !== YT.PlayerState.ENDED) {
			player.playVideo();
			player.unMute();
		} else {
			playSong(`https://www.youtube.com/watch?v=${videoId}`);
			player.unMute();
		}
		playAudio(audioPlayer.src);
	}
};

export const restartPlayback = () => {
	if (player) {
		const currentTime = player.getCurrentTime();
		player.loadVideoById({
			videoId: videoId,
			startSeconds: currentTime, 
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
	playPreviousSong();
});


forwardButton.addEventListener('click', () => {
	playNextSong();
});
