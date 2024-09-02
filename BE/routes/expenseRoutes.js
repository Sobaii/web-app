const express = require("express");
const router = express.Router();
const {
  uploadExpenses,
  createSpreadsheet,
  getSpreadsheet,
  getFileUrl,
  downloadExpensesXLSX,
  deleteSpreadsheet
} = require("../controllers/expenseControllers");
const { upload } = require("../utils/multerConfig");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

// Define routes
router.post("/upload", ensureAuthenticated, upload.array("files", 2000), uploadExpenses);
router.post("/create-spreadsheet", ensureAuthenticated, createSpreadsheet);
router.get("/spreadsheet/:spreadsheetId", ensureAuthenticated, getSpreadsheet);
router.get("/fileUrl/:fileKey", ensureAuthenticated, getFileUrl);
router.post("/download/:spreadsheetId", ensureAuthenticated, downloadExpensesXLSX);
router.delete('/delete-spreadsheet', ensureAuthenticated, deleteSpreadsheet);

module.exports = router;