"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import PDFRender from "@/components/dashboard/spreadsheet/pdf-render";
import Button from "@/components/button";
import {
  getBackgroundColor,
  getAllKeysInNestedObject,
  sortNestedExpenseObject,
  formatSnakeCase,
} from "@/lib/utils";
import { downloadExpensesXLSX, readLocalFilePage } from "@/services/expenseAPI";
import {
  getUserExpenses,
  updateUserExpenses,
  updateUserSpreadsheetName,
} from "@/services/userAPI";
import { toast } from "sonner";
import MultiSelect from "@/components/multi-select";
import UploadFile from "@/components/dashboard/spreadsheet/upload-file";
import Checkbox from "@/components/checkbox";
import Loader from "@/components/loader";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import Image from "next/image";
import ConfidenceGradient from "@/components/dashboard/spreadsheet/confidence-gradient";

interface Expense {
  _id: string;
  [key: string]: any;
}

const Home: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [spreadsheetName, setSpreadsheetName] = useState<string>("");
  const allKeys = getAllKeysInNestedObject(expenses);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({
    key: "INVOICE_RECEIPT_DATE",
    direction: "ascending",
  });
  const [viewingPDF, setViewingPDF] = useState<string | null>(null);
  const [activeExpense, setActiveExpense] = useState<Expense | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const pathname = usePathname();
  const spreadsheetId = pathname.split("/").pop() as string;

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
      setLoading(true);
      try {
        const data = await getUserExpenses(spreadsheetId);
        setSpreadsheetName(data.name);
        console.log(data);
        setExpenses(data.expenses);
      } catch (error) {
        console.error("Error fetching expenses", error);
        toast.error("Failed to load expenses");
      }
      setLoading(false);
    };
    fetchExpenses();
  }, [spreadsheetId]);

  const requestSort = (key: string) => {
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

  const viewPDF = async (
    filename: string,
    filepage: string,
    expense: Expense
  ) => {
    try {
      const fileURL = await readLocalFilePage(filename, filepage);
      setViewingPDF(fileURL);
      setActiveExpense(expense);
      toast.success("PDF loaded successfully");
    } catch (error) {
      console.error("Error loading PDF", error);
      toast.error("Failed to view PDF");
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all([
        updateUserExpenses(expenses, spreadsheetId),
        updateUserSpreadsheetName(spreadsheetName, spreadsheetId),
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

  const handleCheckboxChange = (expenseId: string) => {
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
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-3">
      <ConfidenceGradient />
      <Input
        value={spreadsheetName}
        onChange={(e) => setSpreadsheetName(e.target.value)}
      />
      <Card className="p-2 sticky flex flex-row top-2 left-0 z-50 gap-3">
        {expenses.length > 0 && (
          <MultiSelect
            selected={selectedFields}
            setSelected={setSelectedFields}
            queries={allKeys}
            placeholder="Select Categories"
          />
        )}
        {expenses.length > 0 && (
          <>
            <Button
              handleClick={handleSave}
              imageSrc="/images/save-file.svg"
              text="Save"
            />
            <Button
              handleClick={async () => {
                try {
                  await downloadExpensesXLSX(spreadsheetId, selectedFields);
                  toast.success("CSV file generated successfully");
                } catch (error) {
                  toast.error("Failed to generate CSV file");
                }
              }}
              text="Generate CSV file"
              imageSrc="/images/download-file.svg"
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
            handleClick={removeSelectedExpenses}
            variant="destructive"
            text={`Delete ${selectedExpenses.length} item${
              selectedExpenses.length > 1 ? "s" : ""
            }
          `}
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
                    sortConfig.direction === "ascending"
                      ? "/images/up-arrow.svg"
                      : "/images/down-arrow.svg";
                }
                return (
                  <th
                    key={key}
                    onClick={() => requestSort(key)}
                    className="cursor-pointer hover:bg-neutral-200 p-2 whitespace-nowrap text-sm font-medium"
                  >
                    <span className="inline-block align-middle">
                      {formatSnakeCase(key.toUpperCase())}
                    </span>
                    {arrowImage && (
                      <Image
                        className="inline-block mx-2 h-3"
                        src={arrowImage}
                        alt={
                          sortConfig.direction === "ascending"
                            ? "Up arrow"
                            : "Down arrow"
                        }
                        width={14} // Add appropriate width
                        height={14} // Add appropriate height
                      />
                    )}
                  </th>
                );
              })}

              <th>View PDF</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr
                className={`relative ${
                  expense._id === activeExpense?._id
                    ? "outline-red-500 outline outline-4"
                    : ""
                } z-${expense._id === activeExpense?._id ? "40" : "auto"}`}
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
                <td className="text-center px-2">{index + 1}</td>
                {selectedFields.map((key) => (
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
                      style={{
                        backgroundColor: getBackgroundColor(
                          expense[key]?.confidence || 0
                        ),
                      }}
                      className="text-neutral-950 relative h-8 px-2 w-full min-w-[150px] border-none font-medium text-base"
                    />
                  </td>
                ))}
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
                    text="View PDF"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;
