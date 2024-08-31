const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  updateUserExpense,
  getUserSpreadsheetsInfo,
  updateUserSpreadsheetName
} = require("../controllers/userController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");
require('dotenv').config();

router.get("/authenticate", authenticateUser);
router.post("/login", loginUser);
router.post("/signup", createUser);
router.get("/logout", logoutUser);
router.get("/spreadsheets-shallow-info", ensureAuthenticated, getUserSpreadsheetsInfo);
router.put("/", ensureAuthenticated, updateUser);
router.patch("/update-expenses", ensureAuthenticated, updateUserExpense);
router.patch('/update-spreadsheet-name', ensureAuthenticated, updateUserSpreadsheetName);

module.exports = router;
