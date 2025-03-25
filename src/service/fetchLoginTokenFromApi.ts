import axios from "axios";

export type UserData = {
  id: string,
  email: string,
  username: string,
  created_at: string,
};

export type LogoPosition = "top_left" | "top_right" | "top_center" | "bottom_left" | "bottom_right" | "bottom_center" | "center_left" | "center_right" | "center";

export interface VenueData {
  id: string,
  name: string,
  logo_url: string,
  logo_ratio: number,
  logo_position: LogoPosition,
  logo_transparency: number,
  qr_code_url: string,
  contact_num: number,
  owner: UserData,
  created_at: string,
};

export interface LoginTokenResponse {
  access_token: string,
  venue: VenueData,
};

export const fetchLoginTokenFromApi = async (username: string, password: string) => {
  try {
    const res = await axios.post<LoginTokenResponse>(
      `${import.meta.env.VITE_API_URL}/token`,
      `grant_type=password&username=${username}&password=${password}&scope=&client_id=&client_secret=`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
      }
    )
    return res.data;
  } catch (error) {
    console.error("Error fetching login token from API", error);
    throw error;
  }
}