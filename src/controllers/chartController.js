import dotenv from 'dotenv';
import axios from 'axios';
import moment from 'moment';

dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;
const flag = process.env.NODE_ENV === 'production';
const YOTUBE_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=CityPop&type=video&key=${API_KEY}&order=viewCount`;
const yotubeApiUrl = flag ? YOTUBE_URL : 'http://localhost:4000/public/data/mock.json';

export const findChart = async (req, res) => {
	try {
		const searchResponse = await axios.get(yotubeApiUrl, { credentials: true });

		const videos = searchResponse.data.items;

		const videoDetailsPromises = videos.map(async (video) => {
			const videoId = video.id.videoId;
			const YOTUBE_DETAIL_URL = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`;
			const yotubeDetailApiUrl = flag
				? YOTUBE_DETAIL_URL
				: 'http://localhost:4000/public/data/detail.json';
			const videoDetailsResponse = await axios.get(yotubeDetailApiUrl);
			const duration = videoDetailsResponse.data.items[0].contentDetails.duration;

			return {
				title: video.snippet.title,
				description: video.snippet.description,
				thumbnail: video.snippet.thumbnails.high.url,
				videoId: videoId,
				audioUrl: `https://www.youtube.com/watch?v=${videoId}`,
				duration: moment.utc(moment.duration(duration).asMilliseconds()).format('HH:mm:ss'),
			};
		});
		const updatedVideos = await Promise.all(videoDetailsPromises);

		res.json(updatedVideos);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(500).json({ success: false, message: 'Server error', error: error.toString() });
	}
};
