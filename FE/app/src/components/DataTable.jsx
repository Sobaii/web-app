import React, { useEffect, useRef, useState } from "react";
import "./styles/DataTable.css";
import UpArrow from "../assets/up-arrow.svg";
import DownArrow from "../assets/down-arrow.svg";
import PDFRender from "./PDFRender";
import Button from "./Button";
import getBackgroundColor from "../util/getBackgroundColor";
import getAllKeysInNestedObject from "../util/getAllKeysInNestedObject";
import {
  downloadExpensesXLSX,
  readLocalFilePage,
} from "../services/expenseServices";
import { getUserExpenses, updateUserExpenses, updateUserSpreadsheetName } from "../services/userServices";
import sortNestedExpenseObject from "../util/sortNestedExpenseObject";
import { toast } from "sonner";
import MultiSelect from "./MultiSelect";
import formatSnakeCase from "../util/formatSnakeCase";
import UploadFile from "./UploadFile";
import Checkbox from "./Checkbox";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import Card from "./Card";
import Input from "./Input";
import UploadFileIcon from '../assets/upload-file.svg';
import DownloadFileIcon from '../assets/download-file.svg';
import SaveFileIcon from '../assets/save-file.svg';

function DataTable() {
  const [expenses, setExpenses] = useState([]);
  const [spreadsheetName, setSpreadsheetName] = useState("");
  const allKeys = getAllKeysInNestedObject(expenses);
  const [selectedFields, setSelectedFields] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "INVOICE_RECEIPT_DATE",
    direction: "ascending",
  });
  const [viewingPDF, setViewingPDF] = useState(null);
  const [activeExpense, setActiveExpense] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const spreadsheetId = searchParams.get('spreadsheet');

  useEffect(() => {
    setSelectedFields(
      allKeys.filter(
        (key) =>
          key === "INVOICE_RECEIPT_DATE" ||
          key === "TOTAL" ||
          key === "SUBTOTAL" ||
          key === "TAX" ||
          key === "VENDOR_NAME" ||
          key === "CATEGORY"
      )
    );
  }, [expenses]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const data = await getUserExpenses(spreadsheetId);
      setSpreadsheetName(data.name);
      setExpenses(data.expenses);
      setLoading(false);
    };
    fetchExpenses();
  }, []);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    const sortedFormExpenses = sortNestedExpenseObject(
      expenses,
      key,
      direction
    );
    setExpenses(sortedFormExpenses);
  };

  const viewPDF = async (filename, filepage, expense) => {
    try {
      const fileURL = await readLocalFilePage(filename, filepage);
      setViewingPDF(fileURL);
      setActiveExpense(expense);
      toast.success("PDF loaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to View Receipt");
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all([
        updateUserExpenses(expenses, spreadsheetId),
        updateUserSpreadsheetName(spreadsheetName, spreadsheetId)
      ]);
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };


  const handleClosePDF = () => {
    setActiveExpense(null);
    setViewingPDF(null);
  };

  const handleCheckboxChange = (expenseId) => {
    setSelectedExpenses((prevSelectedExpenses) => {
      if (prevSelectedExpenses.includes(expenseId)) {
        return prevSelectedExpenses.filter((id) => id !== expenseId);
      } else {
        return [...prevSelectedExpenses, expenseId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedExpenses.length === expenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(expenses.map((expense) => expense._id));
    }
  };

  const removeSelectedExpenses = () => {
    setExpenses((currentExpenses) =>
      currentExpenses.filter(
        (expense) => !selectedExpenses.includes(expense._id)
      )
    );
    setSelectedExpenses([]);
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Input value={spreadsheetName} onChange={(e) => setSpreadsheetName(e.target.value)} />
      <Card className='p-2 sticky flex-row top-2 left-0 z-50 gap-3'>
        {expenses.length > 0 && (
          <MultiSelect
            selected={selectedFields}
            setSelected={setSelectedFields}
            queries={allKeys}
            placeholder="Select Categories"
          />
        )}
        <Button text="Upload File" onClick={(e) => setShowUploadModal(true)} imageSrc={UploadFileIcon} />
        {expenses.length > 0 && (
          <>
            <Button text="Save" handleClick={handleSave} imageSrc={SaveFileIcon} />
            <Button
              imageSrc={DownloadFileIcon}
              text="Generate CSV File"
              handleClick={async () => {
                try {
                  await downloadExpensesXLSX(
                    spreadsheetId,
                    selectedFields
                  );
                  toast.success("CSV file generated successfully");
                } catch (error) {
                  toast.error("Failed to generate CSV file");
                }
              }}
            />
          </>
        )}
        {viewingPDF && (
          <PDFRender viewingPDF={viewingPDF} handleClose={handleClosePDF} />
        )}
        <UploadFile
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          setExpenses={setExpenses}
          spreadsheetId={spreadsheetId}
        />
        {selectedExpenses.length > 0 && (
          <Button
            onClick={removeSelectedExpenses}
            variant="destructive"
            text={`Delete ${selectedExpenses.length} item${selectedExpenses.length > 1 ? "s" : ""
              }`}
          />
        )}
      </Card>
      {expenses.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <h2 className="text-2xl font-medium text-neutral-950">
            No expenses found
          </h2>
        </div>
      ) : (
        <table className="border-separate border shadow-md bg-white border-neutral-200 rounded-lg">
          <thead>
            <tr>
              <th className="flex items-center pl-3 justify-center h-10 cursor-default">
                <Checkbox
                  checked={selectedExpenses.length === expenses.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="w-9">#</th>
              {selectedFields.map((key) => {
                let arrowImage = null;
                if (sortConfig.key === key) {
                  arrowImage =
                    sortConfig.direction === "ascending" ? UpArrow : DownArrow;
                }
                return (
                  <th key={key} onClick={() => requestSort(key)} className="cursor-pointer hover:bg-neutral-200 p-2 whitespace-nowrap text-sm font-medium">
                    <span className="inline-block align-middle">{formatSnakeCase(key.toUpperCase())}</span>
                    {arrowImage && (
                      <img
                        className="inline-block mx-2 h-3"
                        src={arrowImage}
                        alt={sortConfig.direction === "ascending" ? "Up arrow" : "Down arrow"}
                      />
                    )}
                  </th>

                );
              })}
              <th>View Receipt</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr
                className={`relative ${expense._id === activeExpense?._id ? '  outline-red-500 outline outline-4' : ''} z-${expense._id === activeExpense?._id ? '40' : 'auto'}`}
                key={expense._id}
              >
                <td className="flex items-center justify-center pl-3 h-8 w-full">
                  <Checkbox
                    key={`${expense._id}-${selectedExpenses.includes(
                      expense._id
                    )}`}
                    checked={selectedExpenses.includes(expense._id)}
                    onChange={() => handleCheckboxChange(expense._id)}
                  />
                </td>
                <td className="text-center px-2">
                  {index + 1}
                </td>
                {selectedFields.map((key) => {
                  return (
                    <td key={`${expense._id.text}-${key}`}>
                      <input
                        value={expense[key]?.text}
                        onChange={(e) => {
                          setExpenses((prev) => {
                            const newExpenses = [...prev];
                            newExpenses[index][key].text = e.target.value;
                            newExpenses[index][key].confidence =
                              e.target.value === "" ? 0 : 100;
                            return newExpenses;
                          });
                        }}
                        style={{ backgroundColor: getBackgroundColor(expense[key]?.confidence || 0) }}
                        className='text-neutral-950 relative h-8 px-2 w-full min-w-[150px] border-none font-medium text-base'
                      />
                    </td>
                  );
                })}
                <td>
                  <Button
                    className="min-h-8 rounded-none w-full text-primary-500"
                    size="s"
                    variant="primary"
                    handleClick={async () => {
                      await viewPDF(
                        expense.FILE_NAME.text,
                        expense.FILE_PAGE.text,
                        expense
                      );
                    }}
                    text="View Receipt"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      )}

    </div>
  );
}

export default DataTable;