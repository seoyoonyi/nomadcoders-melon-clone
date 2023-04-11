/* eslint-disable no-undef */
let player;
const audioPlayer = document.querySelector('#audio-player');
const playButton = document.querySelector('#play-button');
const pauseButton = document.querySelector('#pause-button');
const stopButton = document.querySelector('#stop-button');
const volumeSlider = document.querySelector('#volume-slider');

const audioProgressBar = document.querySelector('.audio-progress-bar');
const audioProgressContainer = document.querySelector('.audio-progress');

const getVideoId = (url) => {
	const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com|\.be)\/(?:watch\?v=)?(.+)/);
	return match ? match[1] : null;
};

let lastVideoId;

export const playSong = (url) => {
	const videoId = getVideoId(url);
	if (!videoId) return;

	if (player) {
		if (lastVideoId === videoId && player.getPlayerState() !== YT.PlayerState.ENDED) {
			player.playVideo();
			return;
		}
		player.loadVideoById(videoId);
	} else {
		player = new YT.Player('player', {
			height: '360',
			width: '640',
			videoId,
			playerVars: {
				autoplay: 0,
				controls: 0,
				modestbranding: 1,
			},
			events: {
				onReady: (event) => {
					event.target.playVideo();
					playAudio(`https://www.youtube.com/watch?v=${videoId}`);
				},
				onStateChange: (event) => {
					// Remove unnecessary logic related to video playback
					if (event.data === YT.PlayerState.ENDED) {
						lastVideoId = null;
						stopAudio();
					} else {
						lastVideoId = videoId;
					}
				},
			},
		});
	}
};

export const pauseSong = () => {
	if (player) {
		player.pauseVideo();
		pauseAudio();
	}
};

export const stopSong = () => {
	if (player) {
		player.stopVideo();
		stopAudio();
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

const playAudio = (url) => {
	audioPlayer.src = url;
	audioPlayer.play();
};

const pauseAudio = () => {
	if (!audioPlayer.paused) {
		audioPlayer.pause();
	}
};

const stopAudio = () => {
	audioPlayer.pause();
	audioPlayer.currentTime = 0;
};

const updateProgressBar = (progressBar, progressContainer) => {
	const percent = (progressBar.currentTime / progressBar.duration) * 100;
	progressContainer.style.width = `${percent}%`;
};

playButton.addEventListener('click', () => {
	playSong('https://www.youtube.com/watch?v=WCCovrKvAtU');
});

pauseButton.addEventListener('click', () => {
	pauseSong();
});

stopButton.addEventListener('click', () => {
	stopSong();
});
volumeSlider.addEventListener('input', () => {
	const volume = volumeSlider.value;
	setVolume(volume);
});

audioProgressBar.addEventListener('input', () => {
	audioPlayer.currentTime = audioProgressBar.value * audioPlayer.duration;
	updateProgressBar(audioPlayer, audioProgressContainer);
});

audioPlayer.addEventListener('timeupdate', () => {
	updateProgressBar(audioPlayer, audioProgressContainer);
});
