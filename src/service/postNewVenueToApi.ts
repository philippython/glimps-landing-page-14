import axios from "axios";
import { VenueData } from "./fetchLoginTokenFromApi";
import { VenueFormValues } from "@/components/VenueSettings";

export const postNewVenueToApi = async (values: VenueFormValues, token: string) => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("contact_num", values.contact_num);
  formData.append("venue_logo", values.venue_logo);
  formData.append("logo_position", values.logo_position);
  formData.append("logo_ratio", values.logo_ratio.toString());
  formData.append("logo_transparency", values.logo_transparency.toString());

  try {
    // const res = await axios.post<VenueData>(
    //   `${import.meta.env.VITE_API_URL}/venue/create`,
    //   formData,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       "Accept": "application/json",
    //       "Authorization": `Bearer ${token}`,
    //     },
    //   }
    // )
    // return res.data;

    // test data
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      "id": "fa25896a-a67d-42c9-be37-5c9c68ad8d44",
      "name": "testvenue",
      "logo_url": "https://ce0efd08-859d-49e1-9cba-f0f35b023325.selstorage.ru/testvenue-IMG_35FF0EC61447-2.jpeg",
      "logo_ratio": 16,
      "logo_position": "top_right",
      "logo_transparency": 16,
      "qr_code_url": "https://8071d91c-ff07-4d1b-b107-56f11d1372d9.selstorage.ru/fa25896a-a67d-42c9-be37-5c9c68ad8d44",
      "contact_num": "4340203423",
      "photos": [],
      "user_venues": [],
      "owner": {
        "id": "ec6ae213-c9b6-45e4-9fce-ec9193b90334",
        "email": "test@example.com",
        "username": "testuser",
        "role": "renter",
        "activated": true,
        "created_at": "2025-04-01T07:55:56.583888"
      },
      "created_at": "2025-04-01T10:02:40.916569"
    };
  } catch (error) {
    console.error("Error sending new venue data to API", error);
    throw error;
  }
}