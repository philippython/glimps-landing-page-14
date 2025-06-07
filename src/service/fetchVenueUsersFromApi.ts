
import axios from "axios";
import { VenuePhotos } from "./fetchVenuePhotosFromApi";

export interface VenueUser {
  "id": string,
  "phone_number": number,
  "telegram_username": string,
  "photos": VenuePhotos[],
  "created_at": string
};

interface VenueUsersDataFromApi {
  "user": VenueUser
};

interface PaginationOptions {
  limit?: number;
  offset?: number;
}

interface VenueUsersResponse {
  users: VenueUser[];
  total_count: number;
}

export const fetchVenueUsersFromApi = async (token: string, venueId: string, pagination?: PaginationOptions): Promise<VenueUsersResponse> => {
  try {
    const params = new URLSearchParams();
    if (pagination?.limit) {
      params.append('limit', pagination.limit.toString());
    }
    if (pagination?.offset) {
      params.append('offset', pagination.offset.toString());
    }
    
    const url = `${import.meta.env.VITE_API_URL}/user/all/${venueId}${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await axios.get<VenueUsersDataFromApi[]>(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );
    const formattedData = res.data.map(data => data.user);
    return {
      users: formattedData,
      total_count: formattedData.length // This should come from the API response
    };
  } catch (error) {
    console.error("Error fetching photos from API", error);
    throw error
  }
}
