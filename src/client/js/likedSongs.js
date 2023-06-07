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
	// 새로운 좋아요 곡을 추가
	const response = await author.post('/api/liked-song', song);
	return response.data;
};

export const getLikedSongs = async () => {
	const response = await author.get('/api/liked-song');
	return response.data;
};

export const removeLikedSongs = async (id) => {
	await author.delete(`/api/liked-song/${id}`);
};

// 처음 페이지 로딩 시 좋아하는 곡 목록 불러오기
window.addEventListener('DOMContentLoaded', async () => {
	try {
		const likedSongs = await getLikedSongs();

		console.log('likedSongs33', likedSongs);

		// 각각의 곡에 대해

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
