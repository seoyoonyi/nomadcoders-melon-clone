/* eslint-disable no-undef */
let player;

const audioPlayer = document.querySelector('#audio-player');
const playButton = document.querySelector('#play-button');
const pauseButton = document.querySelector('#pause-button');
const stopButton = document.querySelector('#stop-button');
const volumeSlider = document.querySelector('#volume-slider');
const progressContainer = document.querySelector('.audio-progress');
const progressBar = document.querySelector('.audio-progress-bar');

let videoId;
let lastVideoId;

window.onYouTubeIframeAPIReady = () => {
	player = new YT.Player('player', {
		height: '0',
		width: '0',
		videoId,
		playerVars: {
			autoplay: 1,
			controls: 0,
			modestbranding: 1,
			playsinline: 1,
			enablejsapi: 1,
			disablekb: 1,
		},
		events: {
			onReady: (event) => {
				onPlayerReady(event, videoId);
			},
			onStateChange: onPlayerStateChange,
		},
	});
};

const getVideoId = (url) => {
	const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com|\.be)\/(?:watch\?v=)?(.+)/);
	return match ? match[1] : null;
};

export const playSong = (url) => {
	videoId = getVideoId(url);
	if (!videoId) return;

	if (player) {
		if (lastVideoId === videoId && player.getPlayerState() !== YT.PlayerState.ENDED) {
			player.playVideo();
			return;
		}
		player.loadVideoById(videoId);
	} else {
		player = new YT.Player('player', {
			height: '0',
			width: '0',
			videoId,
			playerVars: {
				autoplay: 1,
				controls: 0,
				modestbranding: 1,
				playsinline: 1,
				enablejsapi: 1,
				disablekb: 1,
			},
			events: {
				onReady: (event) => {
					onPlayerReady(event, videoId);
				},
				onStateChange: onPlayerStateChange,
			},
		});
	}
};

const onPlayerReady = (event, videoId) => {
	event.target.playVideo();
	lastVideoId = videoId;
	playAudio(`https://www.youtube.com/watch?v=${videoId}`);
};

const onPlayerStateChange = (event) => {
	if (event.data === YT.PlayerState.PLAYING) {
		progressBar.max = player.getDuration(); // Update from audioProgressBar to progressBar
		setInterval(() => updateProgressBar(player), 1000);
	}
	if (event.data === YT.PlayerState.ENDED) {
		lastVideoId = null;
		stopAudio();
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

const updateProgressBarIndependently = () => {
	progressBar.max = player.getDuration();
	setInterval(() => updateProgressBar(player), 1000);
};

const playAudio = (url) => {
	audioPlayer.src = url;
	audioPlayer.play();
};

const pauseAudio = () => {
	if (!audioPlayer.paused) {
		audioPlayer.pause();
	}
	if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
		player.pauseVideo();
	}
};

const stopAudio = () => {
	audioPlayer.pause();
	audioPlayer.currentTime = 0;
	if (player) {
		player.stopVideo();
	}
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

playButton.addEventListener('click', () => {
	if (!audioPlayer.paused) {
		pauseAudio();
	}
	playSong(`https://www.youtube.com/watch?v=${videoId}`);
	updateProgressBarIndependently();
});

pauseButton.addEventListener('click', () => {
	pauseAudio();
	updateProgressBarIndependently();
});

stopButton.addEventListener('click', () => {
	stopAudio();
	updateProgressBarIndependently();
});

volumeSlider.addEventListener('input', () => {
	// const volume = volumeSlider.value / 100;

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
