const express = require("express");
const router = express.Router();
const {
  uploadExpenses,
  createSpreadsheet,
  getSpreadsheet,
  readLocalFilePage,
  downloadExpensesXLSX,
  parseNumbers,
  deleteSpreadsheet
} = require("../controllers/expenseControllers");
const { upload } = require("../utils/multerConfig");
const {ensureAuthenticated} = require("../middleware/authMiddleware");

// Define routes
router.post("/upload", ensureAuthenticated, upload.array("files", 2000), uploadExpenses);
router.post("/create-spreadsheet", ensureAuthenticated, upload.array("files", 2000), createSpreadsheet);
router.get("/:spreadsheetId", ensureAuthenticated, getSpreadsheet);
router.get("/convertNumbers/:spreadsheetId", ensureAuthenticated, parseNumbers);
router.get("/readLocalFilePage/:fileName/:filePage", ensureAuthenticated, readLocalFilePage);
router.post("/download/:spreadsheetId", ensureAuthenticated, downloadExpensesXLSX);
router.delete('/delete-spreadsheet', ensureAuthenticated, deleteSpreadsheet);

module.exports = router;
