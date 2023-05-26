// song.js
import axios from 'axios';
import { API_URL } from './api';

// Get the token from local storage
const token = localStorage.getItem('token');

// Create an instance of axios with the default headers
const api = axios.create({
	baseURL: API_URL,
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

export const addSong = async (song) => {
	const response = await api.post('/api/song', song);
	return response.data;
};

export const getSongs = async () => {
	const response = await api.get('/api/song');
	return response.data;
};

export const removeSong = async (id) => {
	await api.delete(`/api/song/${id}`);
};
