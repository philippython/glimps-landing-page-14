
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
    console.log("Fetching users from:", url);
    
    const res = await axios.get<VenueUsersDataFromApi[]>(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );
    
    console.log("Raw API response:", res.data);
    const formattedData = res.data.map(data => data.user);
    
    // Get total count by making a separate request without pagination
    let totalCount = formattedData.length;
    if (!pagination) {
      totalCount = formattedData.length;
    } else {
      // If pagination is used, we need to get the total count separately
      try {
        const totalUrl = `${import.meta.env.VITE_API_URL}/user/all/${venueId}`;
        const totalRes = await axios.get<VenueUsersDataFromApi[]>(
          totalUrl,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json"
            }
          }
        );
        totalCount = totalRes.data.length;
      } catch (error) {
        console.error("Error fetching total count:", error);
        totalCount = formattedData.length;
      }
    }
    
    console.log("Formatted users:", formattedData);
    console.log("Total count:", totalCount);
    
    return {
      users: formattedData,
      total_count: totalCount
    };
  } catch (error) {
    console.error("Error fetching users from API", error);
    throw error
  }
}
