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

export const fetchVenuePhotosFromApi = async (token: string, venueId: string): Promise<VenuePhotos[]> => {
  try {
    const res = await axios.get<VenuePhotos[]>(
      `${import.meta.env.VITE_API_URL}/photos/all/venues/${venueId}`,
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