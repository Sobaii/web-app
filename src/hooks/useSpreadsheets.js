import { useState, useEffect } from "react";
import { getUserSpreadsheetsShallowInfo } from "../services/userServices";
import {
  createSpreadsheet as createSpreadsheetService,
  deleteSpreadsheet as deleteSpreadsheetService,
} from "../services/expenseServices";

export function useSpreadsheets() {
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSpreadsheetShallowData = async () => {
      setLoading(true);
      try {
        const response = await getUserSpreadsheetsShallowInfo();
        console.log("response", response);
        setSpreadsheets(response);
      } catch (error) {
        console.error("Error getting spreadsheet shallow data", error);
      }
      setLoading(false);
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
    loading,
    createSpreadsheet,
    deleteSpreadsheet,
  };
}
