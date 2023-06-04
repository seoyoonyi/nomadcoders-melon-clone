// song.js
import axios from 'axios';
import { API_URL } from './api';

// Get the token from local storage
const token = localStorage.getItem('token');

// Create an instance of axios with the default headers
const author = axios.create({
	baseURL: API_URL,
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

export const addLikedSongs = async (song) => {
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
