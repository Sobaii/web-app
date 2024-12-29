import { useState, useEffect } from "react";
import {
  getUserExpenses,
  updateUserExpenses,
  updateUserSpreadsheetScreenshot,
  updateUserSpreadsheetName,
  deleteUserExpenses,
} from "../api/userApi";
import { downloadExpensesXLSX, getS3FileUrl } from "../api/expenseApi";
import { sortNestedExpenseObject } from "../util/expenseUtils";
import { toast } from "sonner";

const useDataTable = (spreadsheetId) => {
  const [expenses, setExpenses] = useState([]);
  const [spreadsheetName, setSpreadsheetName] = useState("");
  const [selectedFields, setSelectedFields] = useState([
    "category",
    "company",
    "subtotal",
    "totalTax",
    "total",
    "transactionDate",
  ]);
  const [sortConfig, setSortConfig] = useState({
    key: "transactionDate",
    direction: "ascending",
  });
  const [viewingFileUrl, setViewingFileUrl] = useState(null);
  const [activeExpense, setActiveExpense] = useState(null);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getUserExpenses(spreadsheetId);
        setSpreadsheetName(data.name);
        setExpenses(data.expenses);
      } catch {
        toast.error("Failed to fetch expenses");        
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [spreadsheetId]);

  const requestSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
    setExpenses(sortNestedExpenseObject([...expenses], key, direction));
  };

  const viewPDF = async (filename, expense) => {
    try {
      const fileUrl = await getS3FileUrl(filename);
      setViewingFileUrl(fileUrl);
      setActiveExpense(expense);
      toast.success("PDF loaded successfully");
    } catch (error) {
      toast.error("Failed to View Receipt");
    }
  };

  const handleSave = async (tableRef) => {
    try {
      await Promise.all([
        updateUserSpreadsheetScreenshot(tableRef, spreadsheetId),
        updateUserExpenses(expenses, spreadsheetId),
        updateUserSpreadsheetName(spreadsheetName, spreadsheetId),
      ]);
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error(`Failed to save changes: ${error}`);
    }
  };

  const handleExpenseChange = (index, key, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][key] = value;
    setExpenses(newExpenses);
  };

  const handleCheckboxChange = (expenseId) => {
    setSelectedExpenses((prev) =>
      prev.includes(expenseId)
        ? prev.filter((id) => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleSelectAll = () => {
    setSelectedExpenses((prev) =>
      prev.length === expenses.length
        ? []
        : expenses.map((expense) => expense.id)
    );
  };

  const deleteSelectedExpenses = async () => {
    await deleteUserExpenses(selectedExpenses, spreadsheetId);
    setExpenses((prev) =>
      prev.filter((expense) => !selectedExpenses.includes(expense.id))
    );
    setSelectedExpenses([]);
    toast.success("Expenses deleted successfully");
  };

  const generateCSV = async () => {
    try {
      await downloadExpensesXLSX(spreadsheetId, selectedFields);
      toast.success("CSV file generated successfully");
    } catch (error) {
      toast.error("Failed to generate CSV file");
    }
  };

  return {
    expenses,
    spreadsheetName,
    selectedFields,
    sortConfig,
    viewingFileUrl,
    activeExpense,
    selectedExpenses,
    loading,
    setActiveExpense,
    setExpenses,
    setSpreadsheetName,
    setSelectedFields,
    setViewingFileUrl,
    requestSort,
    viewPDF,
    handleSave,
    handleExpenseChange,
    handleCheckboxChange,
    handleSelectAll,
    deleteSelectedExpenses,
    generateCSV,
  };
};

export default useDataTable;
