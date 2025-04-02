import axios from "axios";
import { VenueFormValues } from "@/components/VenueSettings";
import { VenueData } from "./fetchLoginTokenFromApi";

export const patchVenueSettingsToApi = async (values: VenueFormValues, token: string, id: string) => {
  const { name, contact_num, logo_position, logo_ratio, logo_transparency, venue_logo } = values;
  try {
    const res = await axios.patch<VenueData>(
      `${import.meta.env.VITE_API_URL}/venue/${id}`,
      `name=${name}&contact_num=${contact_num}&logo_position=${logo_position}&logo_ratio=${logo_ratio}&logo_transparency=${logo_transparency}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    )

    if (venue_logo) {
      console.log("Uploading logo to API");
    }

    return res.status === 200;
  } catch (error) {
    console.error("Error updating venue data to API", error);
    throw error;
  }
}