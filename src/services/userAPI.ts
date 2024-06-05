import { Expense, Spreadsheet } from "@/types";
import apiClient from "./apiClient";

export const authenticateUser = async (): Promise<any> => {
  try {
    const response = await apiClient.get(`/users/authenticate`);
    return response.data;
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<any> => {
  try {
    const response = await apiClient.post(`/users/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Failed to login user:", error);
    throw error;
  }
};

export const signUpUser = async (email: string, password: string): Promise<any> => {
  try {
    const response = await apiClient.post(`/users/signup`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Failed to sign up user:", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<any> => {
  try {
    const response = await apiClient.get(`/users/logout`);
    return response.data;
  } catch (error) {
    console.error("Failed to logout user:", error);
    throw error;
  }
};

export const getUserSpreadsheetsShallowInfo = async (): Promise<Spreadsheet[]> => {
  try {
    const response = await apiClient.get(`/users/spreadsheets-shallow-info`);
    return response.data;
  } catch (error) {
    console.error("Failed to get user spreadsheets shallow info:", error);
    throw error;
  }
};

export const updateUserExpenses = async (expenses: Expense[], spreadsheetId: string): Promise<any> => {
  try {
    const response = await apiClient.patch(`/users/update-expenses`, { expenses, spreadsheetId });
    return response.data;
  } catch (error) {
    console.error("Failed to update user expenses:", error);
    throw error;
  }
};

export const updateUserSpreadsheetName = async (name: string, spreadsheetId: string): Promise<any> => {
  try {
    const response = await apiClient.patch(`/users/update-spreadsheet-name`, { name, spreadsheetId });
    return response.data;
  } catch (error) {
    console.error("Failed to update spreadsheet name:", error);
    throw error;
  }
};

export const getUserExpenses = async (spreadsheetId: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/expenses/${spreadsheetId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to update spreadsheet name:", error);
    throw error;
  }
};
