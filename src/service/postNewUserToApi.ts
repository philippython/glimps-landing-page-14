import axios from "axios";
import { UserData } from "./fetchLoginTokenFromApi";

export const postNewUserToApi = async (username: string, email: string, password: string) => {
  try {
    // const res = await axios.post<UserData>(
    //   `${import.meta.env.VITE_API_URL}/auth-user/create`,
    //   {
    //     email,
    //     password,
    //     username,
    //     role: "renter",
    //     invite_code: ""
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Accept": "application/json",
    //     },
    //   }
    // )
    // return res.data;

    // test data
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      "id": "b959cc12-81a3-4065-aa17-502f84d0433b",
      "email": "test2@example.com",
      "username": "testuser2",
      "role": "renter",
      "activated": true,
      "venue": null,
      "created_at": "2025-04-01T08:04:04.899734"
    } as UserData;
  } catch (error) {
    console.error("Error sending new user data to API", error);
    throw error;
  }
}