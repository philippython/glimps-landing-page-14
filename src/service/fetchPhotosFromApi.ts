
import axios from "axios";

interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export const fetchPhotosFromApi = async (uuid: string, pagination?: PaginationOptions) => {
  try {
    const params = new URLSearchParams();
    if (pagination?.limit) {
      params.append('limit', pagination.limit.toString());
    }
    if (pagination?.offset) {
      params.append('offset', pagination.offset.toString());
    }
    
    const url = `${import.meta.env.VITE_API_URL}/link/${uuid}${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching photos from API", error);
    throw error
  }
}
