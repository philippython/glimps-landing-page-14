import axios from "axios";
import { UserData } from "./fetchLoginTokenFromApi";

export const postNewUserToApi = async (username: string, email: string, password: string) => {
  try {
    const res = await axios.post<UserData>(
      `${import.meta.env.VITE_API_URL}/auth-user/create`,
      {
        email,
        password,
        username,
        role: "renter",
        invite_code: ""
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    )
    return res.data;
  } catch (error) {
    console.error("Error sending new user data to API", error);
    throw error;
  }
}