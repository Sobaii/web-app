import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import ConfidenceGradient from "../components/ConfidenceGradient";

function ReceiptSpreadsheet() {
  return (
    <>
      <ConfidenceGradient />
      <DataTable />
    </>
  );
}

export default ReceiptSpreadsheet;
