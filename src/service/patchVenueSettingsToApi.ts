import axios from "axios";
import { VenueData } from "./fetchLoginTokenFromApi";
import { EditVenueFormValues } from "@/lib/createSchema";

export const patchVenueSettingsToApi = async (values: EditVenueFormValues, token: string, id: string) => {
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
    );

    if (venue_logo) {
      const formData = new FormData();
      formData.append("venue_logo", venue_logo);
      const logoRes = await axios.patch<VenueData>(
        `${import.meta.env.VITE_API_URL}/venue/update-logo/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200) {
        throw new Error("Failed to update venue settings");
      }

      if (logoRes.status !== 200) {
        throw new Error("Failed to update logo");
      }
      return res.data;
    }

    return res.data;
  } catch (error) {
    console.error("Error updating venue data to API", error);
    throw error;
  }
}