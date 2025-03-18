import axios from "axios";

export const fetchPhotosFromApi = async (uuid: string) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/link/${import.meta.env.VITE_TESTING_LINK_ID}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching photos from API", error);
    throw error
  }
}