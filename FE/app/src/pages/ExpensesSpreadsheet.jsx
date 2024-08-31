import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import ConfidenceGradient from "../components/ConfidenceGradient";

function ExpensesSpreadsheet() {
  return (
    <>
      <ConfidenceGradient />
      <DataTable />
    </>
  );
}

export default ExpensesSpreadsheet;
