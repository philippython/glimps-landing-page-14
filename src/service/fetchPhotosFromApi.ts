
import axios from "axios";

interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export const fetchPhotosFromApi = async (uuid: string, pagination?: PaginationOptions) => {
  console.log('fetchPhotosFromApi called with:', { uuid, pagination });
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log('API URL:', apiUrl);
    
    if (!apiUrl || apiUrl === 'undefined') {
      console.error('VITE_API_URL is not defined');
      throw new Error('API URL is not configured');
    }

    const params = new URLSearchParams();
    if (pagination?.limit) {
      params.append('limit', pagination.limit.toString());
    }
    if (pagination?.offset) {
      params.append('offset', pagination.offset.toString());
    }
    
    const url = `${apiUrl}/link/${uuid}${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('Making request to:', url);
    
    const res = await axios.get(url);
    console.log('Response received:', res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching photos from API", error);
    throw error;
  }
}
