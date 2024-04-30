import axios from 'axios';
import { API_URL } from './api';

const token = localStorage.getItem('token');

export const author = axios.create({
	baseURL: API_URL,
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

export const addLikedSongs = async (song) => {
	const response = await author.post('/api/user/liked-song', song);
	return response.data;
};

export const getLikedSongs = async () => {
	const response = await author.get('/api/user/liked-song');
	return response.data;
};

export const removeLikedSongs = async (id) => {
	await author.delete(`/api/user/liked-song/${id}`);
};

window.addEventListener('DOMContentLoaded', async () => {
	try {
		const likedSongs = await getLikedSongs();


		likedSongs.forEach((song) => {
			if (song.heartStatus === 'liked') {
				const heartChartButton = document.querySelector(`.heart-${song.videoId}`);

				if (heartChartButton) {
					return heartChartButton.classList.add('heart-active');
				}
			}
		});
	} catch (error) {
		console.error('Failed to load liked songs:', error);
	}
});
