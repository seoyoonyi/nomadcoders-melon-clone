//main.js
import '../scss/styles.scss';

import { getPopularSongs } from './api';
import { playSong, togglePlayback } from './play';

let zIndex = 1;

const chartContent = document.querySelector('.chart-content');

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
			<span>${chartRank[index]}</span>
			<div>
				<img src="${song.thumbnail}" alt="${song.title}" width="120" height="90">
			</div>
			<p>${songTitle}</p>
		`;
		li.setAttribute('data-video-id', song.videoId);
		chartContent.appendChild(li);

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

			bringToFront('#player-modal');
		});
	});
};

getPopularSongs().then((response) => {
	renderSongs(response.data);
});

const makeClosable = (closeButtonSelector, windowSelector) => {
	const closeButton = document.querySelector(closeButtonSelector);
	const window = document.querySelector(windowSelector);

	closeButton.addEventListener('click', () => {
		window.style.display = 'none';
	});
};

const makeShowable = (showButtonSelector, windowSelector) => {
	const showButton = document.querySelector(showButtonSelector);
	const window = document.querySelector(windowSelector);

	showButton.addEventListener('click', () => {
		window.style.display = 'block';
	});
};

const bringToFront = (windowSelector) => {
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
makeShowable('.icon-box', '#player-modal');
makeShowable('.menu li.chart', '#chart-modal');
makeClosable('#player-modal-close', '#player-modal');
makeClosable('#chart-modal-close', '#chart-modal');
makeDraggable('#player-modal-header', '#player-modal');
makeDraggable('#chart-modal-header', '#chart-modal');
