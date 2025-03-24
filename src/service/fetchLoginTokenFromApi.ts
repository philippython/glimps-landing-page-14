import axios from "axios";

export const fetchLoginTokenFromApi = async (username, password) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/token`,
      `grant_type=password&username=${username}&password=${password}&scope=&client_id=&client_secret=`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error fetching login token from API", error);
    throw error;
  }
}