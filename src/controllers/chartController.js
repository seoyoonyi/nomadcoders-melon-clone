import dotenv from 'dotenv';
import axios from 'axios';
import moment from 'moment'; // Add this import statement for moment library

dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;
// const flag = process.env.NODE_ENV === 'production'
const flag = true;
const YOTUBE_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=CityPop&type=video&key=${API_KEY}&order=viewCount`;

const apiUrl = flag ? 'http://localhost:4000/public/data/mock.json' : YOTUBE_URL;

export const findChart = async (req, res) => {
	try {
		// const searchResponse = await axios.get(
		// 	`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=CityPop&type=video&key=${API_KEY}&order=viewCount`,
		// );
		const searchResponse = await axios.get(apiUrl, { credentials: true });

		const videos = searchResponse.data.items;
		// console.log('videos', videos.id.videoId);
		const videoDetailsPromises = videos.map(async (video) => {
			const videoId = video.id.videoId;
			// const videoId = 'T_lC2O1oIew';
			// const videoDetailsResponse = await axios.get(
			// 	`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`,
			// );

			const videoDetailsResponse = await axios.get('http://localhost:4000/public/data/detail.json');
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
		console.error('sss', error);
		res.status(500).send('Internal Server Error222');
	}
};
