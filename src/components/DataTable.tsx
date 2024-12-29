// src/components/DataTable/DataTable.js
import { useRef } from "react";
import "./styles/DataTable.css";
import { useLocation } from "react-router-dom";
import useDataTable from "../hooks/useDataTable";
import { numericKeys } from "../util/expenseUtils";
import { getAllKeysInObjectArray } from "../util";

import ReceiptRender from "./ReceiptRender";
import ReceiptUploadModal from "./ReceiptUploadModal";

import { Button, MultiSelect, Loader, Card, Input } from "./ui";

import DataTableHeader from "./DataTableHeader";
import DataTableRow from "./DataTableRow";

import { DownloadFileIcon, SaveFileIcon } from "../assets/icons";

function DataTable() {
  const location = useLocation();
  const spreadsheetId = new URLSearchParams(location.search).get("spreadsheet");
  const {
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
  } = useDataTable(spreadsheetId);
  const tableRef = useRef(null);

  if (loading) return <Loader />;

  const allKeys = getAllKeysInObjectArray(expenses, ["fileKey", "id"]);

  return (
    <div className="flex flex-col gap-3">
      <Input
        value={spreadsheetName}
        onChange={(e) => setSpreadsheetName(e.target.value)}
      />
      <Card className="p-2 flex-row z-50 gap-3">
        {expenses.length > 0 && (
          <MultiSelect
            selected={selectedFields}
            setSelected={setSelectedFields}
            queries={allKeys}
            placeholder="Select Categories"
          />
        )}
        <ReceiptUploadModal
          setExpenses={setExpenses}
          spreadsheetId={spreadsheetId}
        />
        {expenses.length > 0 && (
          <>
            <Button
              text="Save"
              handleClick={(e) => handleSave(tableRef)}
              imageSrc={SaveFileIcon}
            />
            <Button
              imageSrc={DownloadFileIcon}
              text="Generate CSV File"
              handleClick={generateCSV}
            />
          </>
        )}
        {viewingFileUrl && (
          <ReceiptRender
            fileUrl={viewingFileUrl}
            handleClose={() => {
              setActiveExpense(null);
              setViewingFileUrl(null);
            }}
          />
        )}
        {selectedExpenses.length > 0 && (
          <Button
            handleClick={(e) => deleteSelectedExpenses()}
            variant="destructive"
            text={`Delete ${selectedExpenses.length} item${
              selectedExpenses.length > 1 ? "s" : ""
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
        <table
          ref={tableRef}
          className="border-separate border-spacing-px border bg-neutral-50 border-neutral-300 shadow-lg rounded-lg"
        >
          <thead>
            <DataTableHeader
              selectedFields={selectedFields}
              sortConfig={sortConfig}
              requestSort={requestSort}
              handleSelectAll={handleSelectAll}
              allSelected={selectedExpenses.length === expenses.length}
            />
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <DataTableRow
                key={index}
                expense={expense}
                index={index}
                selectedFields={selectedFields}
                numericKeys={numericKeys}
                isActive={expense === activeExpense}
                isSelected={selectedExpenses.includes(expense.id)}
                onCheckboxChange={handleCheckboxChange}
                onExpenseChange={handleExpenseChange}
                onViewPDF={viewPDF}
              />
            ))}
          </tbody>
        </table>
      )}
      <div style={{ height: "80dvh", visibility: "hidden" }}></div>
    </div>
  );
}

export default DataTable;
