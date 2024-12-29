import { useState, useEffect } from "react";
import { getUserSpreadsheetsShallowInfo } from "../api/userApi";
import {
  createSpreadsheet as createSpreadsheetService,
  deleteSpreadsheet as deleteSpreadsheetService,
} from "../api/expenseApi";

export function useSpreadsheets() {
  const [spreadsheets, setSpreadsheets] = useState([]);

  
  useEffect(() => {
    const getSpreadsheetShallowData = async () => {
      try {
        const response = await getUserSpreadsheetsShallowInfo();
        setSpreadsheets(response);
      } catch (error) {
        console.error("Error getting spreadsheet shallow data", error);
      }
    };
    getSpreadsheetShallowData();

  }, []);

  const createSpreadsheet = async (name) => {
    try {
      const response = await createSpreadsheetService(name);
      setSpreadsheets([...spreadsheets, response]);
      return response;
    } catch (error) {
      console.error("Error creating spreadsheet", error);
      throw error;
    }
  };

  const deleteSpreadsheet = async (id) => {
    try {
      await deleteSpreadsheetService(id);
      setSpreadsheets(
        spreadsheets.filter((spreadsheet) => spreadsheet.id !== id)
      );
    } catch (error) {
      console.error("Error deleting spreadsheet", error);
      throw error;
    }
  };

  return {
    spreadsheets,
    createSpreadsheet,
    deleteSpreadsheet,
  };
}
