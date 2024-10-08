import { convertHTMLElementToImage } from "../util";
import fetchCallWrapper from "./fetchCallWrapper";

const baseUrl = "http://localhost:3000";

export const authenticateUser = async () => {
  const options = {
    method: "GET",
  };
  return await fetchCallWrapper(`${baseUrl}/users/authenticate`, options);
};

export const loginUser = async (email, password) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  return await fetchCallWrapper(`${baseUrl}/users/login`, options);
};

export const signUpUser = async (email, password) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  return await fetchCallWrapper(`http://localhost:3000/users/signup`, options);
};

export const logoutUser = async () => {
  const options = {
    method: "GET",
  };

  return await fetchCallWrapper(`http://localhost:3000/users/logout`, options);
};

export const signUpUserWithGoogle = async () => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await fetchCallWrapper(`http://localhost:3000/auth/google`, options);
};

export const getUserExpenses = async (spreadsheetId) => {
  const options = {
    method: "GET",
  };

  return await fetchCallWrapper(
    `${baseUrl}/expenses/spreadsheet/${spreadsheetId}`,
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

  return await fetchCallWrapper(`${baseUrl}/users/update-expenses`, options);
};

export const updateUserSpreadsheetScreenshot = async (
  tableRef,
  spreadsheetId
) => {
  try {
    const screenshotPreview = await convertHTMLElementToImage(tableRef);
    const formData = new FormData();
    formData.append("file", screenshotPreview)
    
    const options = {
      method: "PATCH",
      credentials: "include",
      body: formData,
    };

    return await fetchCallWrapper(`${baseUrl}/users/update-spreadsheet-screenshot/${spreadsheetId}`, options);
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

  return await fetchCallWrapper(
    `${baseUrl}/users/update-spreadsheet-name`,
    options
  );
};

export const getUserGoogleInfo = async () => {
  const options = {
    method: "GET",
  };

  return await fetchCallWrapper(`${baseUrl}/auth/google/userinfo`, options);
};

export const getUserSpreadsheetsShallowInfo = async () => {
  const options = {
    method: "GET",
  };

  return await fetchCallWrapper(
    `${baseUrl}/users/spreadsheets-shallow-info`,
    options
  );
};
