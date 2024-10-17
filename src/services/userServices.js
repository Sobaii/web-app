import { convertHTMLElementToImage } from "../util";
import fetchCallWrapper from "./fetchCallWrapper";

const baseUrl = `${import.meta.env.VITE_SERVER_URL}/users`;
const expensesBaseUrl = `${import.meta.env.VITE_SERVER_URL}/expenses`;

export const authenticateUser = async () => {
  const options = {
    method: "GET",
  };
  return await fetchCallWrapper(`${baseUrl}/authenticate`, options);
};

export const loginUser = async (email, password) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  return await fetchCallWrapper(`${baseUrl}/login`, options);
};

export const signUpUser = async (email, password) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  return await fetchCallWrapper(`${baseUrl}/signup`, options);
};

export const logoutUser = async () => {
  const options = {
    method: "GET",
  };

  return await fetchCallWrapper(`${baseUrl}/logout`, options);
};

export const getUserExpenses = async (spreadsheetId) => {
  const options = {
    method: "GET",
  };

  return await fetchCallWrapper(
    `${expensesBaseUrl}/spreadsheet/${spreadsheetId}`,
    options
  );
};

export const updateUserExpenses = async (expenses, spreadsheetId) => {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expenses, spreadsheetId }),
  };

  return await fetchCallWrapper(`${baseUrl}/update-expenses`, options);
};

export const updateUserSpreadsheetScreenshot = async (
  tableRef,
  spreadsheetId
) => {
  try {
    console.log("spreadsheetid", spreadsheetId);
    const screenshotPreview = await convertHTMLElementToImage(tableRef);
    const formData = new FormData();
    formData.append("file", screenshotPreview);

    const options = {
      method: "PATCH",
      credentials: "include",
      body: formData,
    };

    return await fetchCallWrapper(
      `${baseUrl}/update-spreadsheet-screenshot/${spreadsheetId}`,
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

  return await fetchCallWrapper(`${baseUrl}/update-spreadsheet-name`, options);
};

export const getUserSpreadsheetsShallowInfo = async () => {
  const options = {
    method: "GET",
  };

  return await fetchCallWrapper(
    `${baseUrl}/spreadsheets-shallow-info`,
    options
  );
};
