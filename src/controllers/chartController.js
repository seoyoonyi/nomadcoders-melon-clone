import dotenv from 'dotenv';
import axios from 'axios';
import moment from 'moment';

dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;
let flag = process.env.NODE_ENV === 'production';
const YOUTUBE_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=CityPop&type=video&key=${API_KEY}&order=viewCount`;
const yotubeApiUrl = flag ? YOUTUBE_URL : 'http://localhost:4000/public/data/mock.json';

export const findChart = async (req, res) => {
	try {
		let searchResponse;
		try {
			searchResponse = await axios.get(yotubeApiUrl, { credentials: true });
		} catch (error) {
			if (error.response && error.response.status === 403) {
				res
					.status(403)
					.json({
						success: false,
						message: 'API 호출 횟수가 초과되어 로컬 데이터를 사용합니다.',
						error: error.toString(),
					});
				searchResponse = await axios.get('http://localhost:4000/public/data/mock.json');
			} else {
				throw error;
			}
		}

		const videos = searchResponse.data.items;

		const videoDetailsPromises = videos.map(async (video) => {
			const videoId = video.id.videoId;
			const YOTUBE_DETAIL_URL = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`;
			const yotubeDetailUrl = flag
				? YOTUBE_DETAIL_URL
				: 'http://localhost:4000/public/data/detail.json';
			let videoDetailsResponse;
			try {
				videoDetailsResponse = await axios.get(yotubeDetailUrl);
			} catch (error) {
				if (error.response && error.response.status === 403) {
					res
						.status(403)
						.json({
							success: false,
							message: 'API 호출 횟수가 초과되어 로컬 데이터를 사용합니다.',
							error: error.toString(),
						});
					videoDetailsResponse = await axios.get('http://localhost:4000/public/data/detail.json');
				} else {
					throw error;
				}
			}

			const duration = videoDetailsResponse.data.items[0].contentDetails.duration;

			return {
				title: video.snippet.title,
				description: video.snippet.description,
				thumbnail: video.snippet.thumbnails.high.url,
				videoId: videoId,
				audioUrl: `https://www.youtube.com/watch?v=${videoId}`,
				duration: moment.utc(moment.duration(duration).asMilliseconds()).format('HH:mm:ss'),
				heartStatus: 'unlike',
			};
		});

		const updatedVideos = await Promise.all(videoDetailsPromises);
		res.json(updatedVideos);
	} catch (error) {
		res.status(500).json({ success: false, message: 'Server error', error: error.toString() });
	}
};
