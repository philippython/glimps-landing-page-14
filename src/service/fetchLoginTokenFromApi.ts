import axios from "axios";

export const fetchLoginTokenFromApi = async (username, password) => {
  try {
    console.log("fetchLoginTokenFromApi", username, password);
  } catch (error) {
    console.error("Error fetching login token from API", error);
    throw error;
  }
}