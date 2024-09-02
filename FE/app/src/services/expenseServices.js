import fetchCallWrapper from "./fetchCallWrapper";

const baseUrl = "http://localhost:3000/expenses";

export const getFileUrl = async (fileName) => {
  const url = `${baseUrl}/fileUrl/${fileName}`;
  const options = {
    method: "GET",
  };

  try {
    const response = await fetchCallWrapper(url, options);
    return response.url;
  } catch (error) {
    console.error("Failed to read S3 file:", error);
    throw error;
  }
};

export const downloadExpensesXLSX = async (spreadsheetId, selectedFields) => {
  const url = `${baseUrl}/download/${spreadsheetId}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ selectedFields }),
  };

  try {
    const response = await fetchCallWrapper(url, options, false);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "Expenses.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Failed to download XLSX:", error);
    throw error;
  }
};

export const uploadMultiPageExpenses = async (file, spreadsheetId) => {
  const formData = new FormData();
  formData.append("file", file);
  if (spreadsheetId) {
    formData.append("spreadsheetId", spreadsheetId);
  }

  const options = {
    method: "POST",
    body: formData,
  };

  return await fetchCallWrapper(`${baseUrl}/uploadMultiPageExpenses`, options);
};

export const uploadExpenses = async (files, spreadsheetId) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  if (spreadsheetId) {
    formData.append("spreadsheetId", spreadsheetId);
  }

  const options = {
    method: "POST",
    credentials: "include",
    body: formData,
  };

  return await fetchCallWrapper(`${baseUrl}/upload`, options);
};

export const createSpreadsheet = async (spreadsheetName) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spreadsheetName }),
  };
  return await fetchCallWrapper(`${baseUrl}/create-spreadsheet`, options);
};

export const deleteSpreadsheet = async (spreadsheetId) => {
  const options = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spreadsheetId }),
  };
  return await fetchCallWrapper(`${baseUrl}/delete-spreadsheet`, options);
};
