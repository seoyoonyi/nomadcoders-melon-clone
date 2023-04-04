import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;
export const findChart = async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=CityPop&type=video&key=${API_KEY}&order=viewCount`
    );
    const videos = response.data.items.map((item) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      videoId: item.id.videoId,
    }));
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
