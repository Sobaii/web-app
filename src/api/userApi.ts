import { convertHTMLElementToImage } from "../util";
import fetchWrapper from "./fetchWrapper";

const baseUrl = `${import.meta.env.VITE_SERVER_URL}`; 

export const authenticateUser = async () => {
  const options = {
    method: "GET",
  };
  return await fetchWrapper(`${baseUrl}/users/authenticate`, options);
};

export const loginUser = async (email, password) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  return await fetchWrapper(`${baseUrl}/users/login`, options);
};

export const signUpUser = async (email, password) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  return await fetchWrapper(`${baseUrl}/users/signup`, options);
};

export const logoutUser = async () => {
  const options = {
    method: "GET",
  };

  return await fetchWrapper(`${baseUrl}/users/logout`, options);
};

export const getUserExpenses = async (spreadsheetId) => {
  const options = {
    method: "GET",
  };

  return await fetchWrapper(
    `${baseUrl}/expenses/spreadsheet/${spreadsheetId}`,
    options
  );
};

export const deleteUserExpenses = async (expenses, spreadsheetId) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expenses, spreadsheetId }),
  };

  return await fetchWrapper(`${baseUrl}/users/update-expenses`, options);
};

export const updateUserExpenses = async (expenses, spreadsheetId) => {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expenses, spreadsheetId }),
  };

  return await fetchWrapper(`${baseUrl}/users/update-expenses`, options);
};

export const updateUserSpreadsheetScreenshot = async (
  tableRef,
  spreadsheetId
) => {
  try {
    const screenshotPreview = await convertHTMLElementToImage(tableRef);
    const formData = new FormData();
    formData.append("file", screenshotPreview);

    const options = {
      method: "PATCH",
      credentials: "include",
      body: formData,
    };

    return await fetchWrapper(
      `${baseUrl}/users/update-spreadsheet-screenshot/${spreadsheetId}`,
      options
    );
  } catch (error) {
    console.error("Error updating user spreadsheet screenshot:", error);
  }
};

export const updateUserSpreadsheetName = async (name, spreadsheetId) => {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, spreadsheetId }),
  };

  return await fetchWrapper(`${baseUrl}/users/update-spreadsheet-name`, options);
};

export const getUserSpreadsheetsShallowInfo = async () => {
  const options = {
    method: "GET",
  };

  return await fetchWrapper(
    `${baseUrl}/users/spreadsheets-shallow-info`,
    options
  );
};
