/* eslint-disable no-undef */
let player;
const audioPlayer = document.querySelector('#audio-player');
const playButton = document.querySelector('#play-button');
const pauseButton = document.querySelector('#pause-button');
const stopButton = document.querySelector('#stop-button');
const volumeSlider = document.querySelector('#volume-slider');

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
					if (event.data === YT.PlayerState.PLAYING) {
						pauseAudio();
					}
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
		player.setVolume(volume);
		audioPlayer.volume = volume;
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

const video = document.querySelector('video');
const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress');

// 비디오가 로드되면 최대 길이를 계산합니다.
video.addEventListener('loadedmetadata', () => {
	progressBar.style.width = '0%';
	const duration = video.duration;
	progressContainer.addEventListener('click', (event) => {
		const offsetX = event.offsetX;
		const percent = offsetX / progressContainer.offsetWidth;
		progressBar.style.width = percent * 100 + '%';
		video.currentTime = percent * duration;
	});
});

// 비디오가 재생되면 진행바를 업데이트합니다.
video.addEventListener('timeupdate', () => {
	const currentTime = video.currentTime;
	const percent = (currentTime / video.duration) * 100;
	progressBar.style.width = percent + '%';
});
