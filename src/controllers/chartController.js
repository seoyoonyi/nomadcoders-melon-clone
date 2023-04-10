import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;
export const findChart = async (req, res) => {
	try {
		const response = await axios.get(
			`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=CityPop&type=video&key=${API_KEY}&order=viewCount`,
		);

		console.log('serverresponse', response.data.items);
		const videos = response.data.items.map((item) => ({
			title: item.snippet.title,
			description: item.snippet.description,
			thumbnail: item.snippet.thumbnails.high.url,
			videoId: item.id.videoId,
			audioUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
			duration:
				item.contentDetails && item.contentDetails.duration
					? item.contentDetails.duration
					: 'unknown', // contentDetails 속성이 존재하지 않는 경우나 duration 속성이 없는 경우, 'unknown' 값을 할당
		}));
		res.json(videos);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
};
