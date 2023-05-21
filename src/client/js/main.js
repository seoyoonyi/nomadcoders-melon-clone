//main.js
import '../scss/styles.scss';

import { getPopularSongs } from './api';
import { playSong, togglePlayback } from './play';

// Add the following code to handle the "chart" click event
const chartOption = document.querySelector('.menu li.chart');
const chartModal = document.querySelector('#chart-modal');

const renderSongs = (songs) => {
	// const songList = document.querySelector('#song-list');
	if (!chartModal) return;
	chartModal.innerHTML = '';

	songs.forEach((song) => {
		const li = document.createElement('li');
		li.innerHTML = `
			<img src="${song.thumbnail}" alt="${song.title}" width="120" height="90">
			<p>${song.title}</p>
		`;
		li.setAttribute('data-video-id', song.videoId);
		chartModal.appendChild(li);

		li.addEventListener('click', (event) => {
			const videoId = event.currentTarget.getAttribute('data-video-id');
			if (videoId) {
				playSong(`https://www.youtube.com/watch?v=${videoId}`);
				togglePlayback();
			}
		});
	});
};

getPopularSongs().then((response) => {
	renderSongs(response.data);
});

chartOption.addEventListener('click', () => {
	chartModal.classList.add('show');
});
