import apiClient from "./apiClient";
import { GoogleUserInfo } from "../types";

// Function to sign up user with Google
export const signUpUserWithGoogle = async (): Promise<GoogleUserInfo> => {
  try {
    const response = await apiClient.post<GoogleUserInfo>(`/auth/google`);
    return response.data;
  } catch (error) {
    console.error("Failed to sign up user with Google:", error);
    throw error;
  }
};

// Function to get user Google info
export const getUserGoogleInfo = async (): Promise<GoogleUserInfo> => {
  try {
    const response = await apiClient.get<GoogleUserInfo>(
      `/auth/google/userinfo`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get user Google info:", error);
    throw error;
  }
};
