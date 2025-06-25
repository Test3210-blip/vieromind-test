import axios, { AxiosRequestConfig } from "axios";

export async function apiRequest(config: AxiosRequestConfig) {
  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    // Optionally show toast here
    throw error.response?.data?.message || "Something went wrong";
  }
}
