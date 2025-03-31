import axios from "axios";

export type UserData = {
  id: string,
  email: string,
  username: string,
  role: "renter" | "admin",
  created_at: string,
};

export enum LogoPosition {
  topLeft = "top_left",
  topRight = "top_right",
  topCenter = "top_center",
  bottomLeft = "bottom_left",
  bottomRight = "bottom_right",
  bottomCenter = "bottom_center",
  centerLeft = "center_left",
  centerRight = "center_right",
  center = "center",
}

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