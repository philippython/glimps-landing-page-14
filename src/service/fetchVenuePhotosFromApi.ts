
import axios from "axios";

export type VenuePhotos = {
  "id": string,
  "photo_url": string,
  "synced": boolean,
  "sent": boolean,
  "user_id": string,
  "link_id": string,
  "created_at": string
}

interface PaginationOptions {
  limit?: number;
  offset?: number;
}

interface VenuePhotosResponse {
  photos: VenuePhotos[];
  total_count: number;
}

export const fetchVenuePhotosFromApi = async (token: string, venueId: string, pagination?: PaginationOptions): Promise<VenuePhotosResponse> => {
  try {
    const params = new URLSearchParams();
    if (pagination?.limit) {
      params.append('limit', pagination.limit.toString());
    }
    if (pagination?.offset) {
      params.append('offset', pagination.offset.toString());
    }
    
    const url = `${import.meta.env.VITE_API_URL}/photos/all/venues/${venueId}${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await axios.get<VenuePhotosResponse>(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching photos from API", error);
    throw error
  }
}
