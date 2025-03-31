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

export const fetchVenueUsersFromApi = async (token: string, venueId: string): Promise<VenueUser[]> => {
  try {
    const res = await axios.get<VenueUsersDataFromApi[]>(
      `${import.meta.env.VITE_API_URL}/user/all/${venueId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );
    const formattedData = res.data.map(data => data.user);
    return formattedData;
  } catch (error) {
    console.error("Error fetching photos from API", error);
    throw error
  }
}