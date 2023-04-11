import '../scss/styles.scss';

import { getPopularSongs } from './api';
import { playSong } from './play';

const renderSongs = (songs) => {
	console.log('songs', songs);

	const songList = document.querySelector('#song-list');
	if (!songList) return;
	songList.innerHTML = '';

	songs.forEach((song) => {
		const li = document.createElement('li');
		li.innerHTML = `
			<img src="${song.thumbnail}" alt="${song.title}" width="120" height="90">
			<p>${song.title}</p>
		`;
		li.setAttribute('data-video-id', song.videoId);
		songList.appendChild(li);

		li.addEventListener('click', (event) => {
			const videoId = event.currentTarget.getAttribute('data-video-id');
			if (videoId) {
				playSong(`https://www.youtube.com/watch?v=${videoId}`);
			}
		});
	});
};

getPopularSongs().then((response) => {
	renderSongs(response.data);
});
