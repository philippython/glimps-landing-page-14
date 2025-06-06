import axios from "axios";
import { VenueData } from "./fetchLoginTokenFromApi";
import placeholder from "/placeholder.svg";
import { CreateVenueFormValues } from "@/lib/createSchema";

export const postNewVenueToApi = async (values: CreateVenueFormValues, token: string) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("contact_num", values.contact_num);
  formData.append("venue_logo", values.venue_logo ?? placeholder);
  formData.append("logo_position", values.logo_position);
  formData.append("logo_ratio", values.logo_ratio.toString());
  formData.append("logo_transparency", values.logo_transparency.toString());

  try {
    const res = await axios.post<VenueData>(
      `${import.meta.env.VITE_API_URL}/venue/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    )
    return res.data;
  } catch (error) {
    console.error("Error sending new venue data to API", error);
    throw error;
  }
}