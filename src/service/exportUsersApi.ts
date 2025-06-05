import axios from "axios";

export interface ExportUserProcess {
  id: string,
  status: "aborted" | "failed" | "in_progress" | "success",
  link: string | null,
};

export const startExportUsersProcess = async (token: string): Promise<ExportUserProcess> => {
  try {
    const res = await axios.put<ExportUserProcess>(
      `${import.meta.env.VITE_API_URL}/user/xlsx-report`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error requesting user report", error);
    throw error;
  }
};

export const getExportUsersProcess = async (token: string, processId: string): Promise<ExportUserProcess> => {
  try {
    const res = await axios.get<ExportUserProcess>(
      `${import.meta.env.VITE_API_URL}/user/xlsx-report/${processId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching user report status", error);
    throw error;
  }
};

export const deleteExportUsersProcess = async (token: string, processId: string): Promise<void> => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/user/xlsx-report/${processId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error fetching user report status", error);
    throw error;
  }
};
