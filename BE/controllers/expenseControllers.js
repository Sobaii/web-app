const asyncHandler = require("express-async-handler");
const {
  s3UploadFile,
  s3GetFileSignedUrl,
  s3DeleteFile,
} = require("../services/s3Service");
const xlsx = require("xlsx");
const User = require("../schemas/userSchema");
const { ApiError } = require("../middleware/errorHandler");
const sharp = require("sharp");
const { analyzeFile } = require("../services/ocrService");

const BUCKET_NAME = "accounting-ai-td";

const createSpreadsheet = asyncHandler(async (req, res) => {
  const { user, body: { spreadsheetName } } = req;
  user.spreadsheets.push({ name: spreadsheetName, expenses: [] });
  await user.save();
  res.json(user.spreadsheets[user.spreadsheets.length - 1]);
});

const getFileUrl = asyncHandler(async (req, res) => {
  const { fileKey } = req.params;
  const url = await s3GetFileSignedUrl(BUCKET_NAME, fileKey);
  res.json({ url });
});

const uploadExpenses = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) throw new ApiError("No files uploaded", 400);
  const { spreadsheetId } = req.body;
  const processedResults = await Promise.all(
    req.files.map(async (file) => {
      let fileBuffer;
      if (file.mimetype.startsWith("image/")) {
        fileBuffer = await sharp(file.buffer)
          .resize({ height: 2080, width: 2080, fit: "contain" })
          .toBuffer();
      } else if (file.mimetype === "application/pdf") {
        fileBuffer = file.buffer;
      } else {
        throw new ApiError("Unsupported file type", 400);  
      }
      const fileKey = await s3UploadFile(BUCKET_NAME, fileBuffer, file.mimetype);
      const url = await s3GetFileSignedUrl(BUCKET_NAME, fileKey);
      const data = await analyzeFile(url);
      return { ...data, fileKey }
    })
  );

  await User.updateOne(
    { _id: req.user._id, "spreadsheets._id": spreadsheetId },
    { $push: { "spreadsheets.$.expenses": { $each: processedResults } } }
  );
  res.json(processedResults);
});


const getSpreadsheetFunction = async (req, res) => {
  const { spreadsheetId } = req.params;
  const spreadsheet = req.user.spreadsheets.id(spreadsheetId);
  if (!spreadsheet) throw new ApiError("Spreadsheet not found", 404);
  return spreadsheet;
};

const getSpreadsheet = asyncHandler(async (req, res) => {
  const spreadsheet = await getSpreadsheetFunction(req, res);
  res.json(spreadsheet);
});

const downloadExpensesXLSX = asyncHandler(async (req, res) => {
  const { selectedFields } = req.body;
  const { expenses } = await getSpreadsheetFunction(req, res);
  if (expenses.length === 0) throw new ApiError("No items found", 404);

  const categoryGroups = expenses.reduce((groups, expense) => {
    const category = expense.CATEGORY;
    if (!groups[category]) groups[category] = [];
    const filteredExpense = selectedFields.reduce((acc, field) => {
      if (expense[field]) acc[field] = expense[field];
      return acc;
    }, {});
    groups[category].push(filteredExpense);
    return groups;
  }, {});

  const workbook = xlsx.utils.book_new();
  Object.entries(categoryGroups).forEach(([category, data]) => {
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, category);
  });

  const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", 'attachment; filename="Expenses.xlsx"');
  res.send(buffer);
});

const deleteSpreadsheet = asyncHandler(async (req, res) => {
  const { spreadsheetId } = req.body;
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { spreadsheets: { _id: spreadsheetId } } }
  );
  res.json({ message: "Spreadsheet deleted successfully" });
});

module.exports = {
  uploadExpenses,
  createSpreadsheet,
  getSpreadsheet,
  getFileUrl,
  downloadExpensesXLSX,
  deleteSpreadsheet,
};
