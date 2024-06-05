import apiClient from "./apiClient";

// Define types for the function parameters and return values
export const readLocalFilePage = async (fileName: string, filePage: string): Promise<string> => {
  try {
    const response = await apiClient.get<Blob>(`/expenses/readLocalFilePage/${fileName}/${filePage}`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Failed to read S3 file page:", error);
    throw error;
  }
};

export const downloadExpensesXLSX = async (spreadsheetId: string, selectedFields: string[]): Promise<void> => {
  try {
    const response = await apiClient.post<Blob>(`/expenses/download/${spreadsheetId}`, { selectedFields }, {
      responseType: 'blob',
    });
    const downloadUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "Expenses.xlsx");
    document.body.appendChild(link);
    link.click();
    link?.parentNode?.removeChild(link);
  } catch (error) {
    console.error("Failed to download XLSX:", error);
    throw error;
  }
};

export const uploadMultiPageExpenses = async (file: File, spreadsheetId?: string): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);
  if (spreadsheetId) {
    formData.append("spreadsheetId", spreadsheetId);
  }

  try {
    const response = await apiClient.post<any>(`/expenses/uploadMultiPageExpenses`, formData);
    return response.data;
  } catch (error) {
    console.error("Failed to upload multi-page expenses:", error);
    throw error;
  }
};

export const uploadExpenses = async (files: File[], spreadsheetId?: string): Promise<any> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  if (spreadsheetId) {
    formData.append("spreadsheetId", spreadsheetId);
  }

  try {
    const response = await apiClient.post<any>(`/expenses/upload`, formData);
    return response.data;
  } catch (error) {
    console.error("Failed to upload expenses:", error);
    throw error;
  }
};

export const convertNumbers = async (spreadsheetId: string): Promise<any> => {
  try {
    const response = await apiClient.get<any>(`/expenses/convertNumbers/${spreadsheetId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to convert numbers:", error);
    throw error;
  }
};

export const createSpreadsheet = async (spreadsheetName: string): Promise<any> => {
  try {
    const response = await apiClient.post<any>(`/expenses/create-spreadsheet`, { spreadsheetName });
    return response.data;
  } catch (error) {
    console.error("Failed to create spreadsheet:", error);
    throw error;
  }
};

export const deleteSpreadsheet = async (spreadsheetId: string): Promise<any> => {
  try {
    const response = await apiClient.delete<any>(`/expenses/delete-spreadsheet`, { data: { spreadsheetId } });
    return response.data;
  } catch (error) {
    console.error("Failed to delete spreadsheet:", error);
    throw error;
  }
};

export const getUserExpenses = async (spreadsheetId: string): Promise<any> => {
  try {
    const response = await apiClient.get<any>(`/expenses/${spreadsheetId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get user expenses:", error);
    throw error;
  }
};
