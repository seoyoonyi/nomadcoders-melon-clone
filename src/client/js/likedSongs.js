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
	const existingSongs = await getLikedSongs();

	// 이미 좋아요한 곡인지 확인
	const isAlreadyLiked = existingSongs.some(
		(existingSong) =>
			existingSong.videoId === song.videoId && existingSong.heartStatus === song.heartStatus,
	);
	// 이미 좋아요한 곡이라면 DB에서 해당 곡을 제거하고 함수 종료
	if (isAlreadyLiked) {
		const likedSong = existingSongs.find((existingSong) => existingSong.id === song.id);
		if (likedSong && likedSong.id) {
			await removeLikedSongs(likedSong.id); // DB에서 제거
			alert('You have removed this song from your liked songs.');
			return;
		} else {
			throw new Error('The liked song does not have a valid id.');
		}
	}

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
