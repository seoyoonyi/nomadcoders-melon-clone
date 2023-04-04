import axios from "axios";

const API_URL = "http://localhost:4000";
export const getPopularSongs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/chart`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
