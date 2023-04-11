import dotenv from 'dotenv';
import axios from 'axios';
import moment from 'moment'; // Add this import statement for moment library

dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;
export const findChart = async (req, res) => {
	try {
		const searchResponse = await axios.get(
			`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=CityPop&type=video&key=${API_KEY}&order=viewCount`,
		);
		const videos = searchResponse.data.items;
		const videoDetailsPromises = videos.map(async (video) => {
			const videoId = video.id.videoId;
			const videoDetailsResponse = await axios.get(
				`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`,
			);
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
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
};
