import axios from "axios";
import { VenueFormValues } from "@/components/VenueSettings";

export const patchVenueSettingsToApi = async (values: VenueFormValues, token: string) => {
  try {
    console.log("values", values);
    return null;
  } catch (error) {
    console.error("Error updating venue data to API", error);
    throw error;
  }
}