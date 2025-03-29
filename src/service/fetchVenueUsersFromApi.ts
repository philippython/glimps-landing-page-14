import axios from "axios";

export type VenueUser = {
  "id": string,
  "synced": boolean,
  "user_id": string,
  "venue_id": string,
  "created_at": string
}

export const fetchVenueUsersFromApi = async (token: string, venueId: string): Promise<VenueUser[]> => {
  try {
    const res = await axios.get<VenueUser[]>(
      `${import.meta.env.VITE_API_URL}/user/all/${venueId}`,
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