
import axios from "axios";
import { UserData, VenueData } from "./fetchLoginTokenFromApi";
import { PasswordFormValues, ProfileFormValues } from "@/lib/createSchema";

export type PatchUserSettingsToApiResponse = {
  "id": string,
  "venue": VenueData,
}

export const patchAccountInfoToApi = async (values: ProfileFormValues, token: string, user: UserData) => {
  try {
    const res = await axios.patch<PatchUserSettingsToApiResponse>(
      `${import.meta.env.VITE_API_URL}/auth-user/${user.id}`,
      {
        "email": values.email,
        "password": "",
        "username": values.username,
        "role": user.role,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating user data to API", error);
    throw error;
  }
}

export const patchPasswordToApi = async (values: PasswordFormValues, token: string, user: UserData) => {
  try {
    const res = await axios.patch<PatchUserSettingsToApiResponse>(
      `${import.meta.env.VITE_API_URL}/auth-user/${user.id}`,
      {
        "email": user.email,
        "password": values.newPassword,
        "username": user.username,
        "role": user.role,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error updating user password to API", error);
    throw error;
  }
}
