const { PDFDocument } = require("pdf-lib");
const { Readable } = require("stream");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const pdf = require("pdf-parse");
const path = require("path");
const fs = require("fs");
const {
  analyzeExpenseDocument,
  startTextractAnalysis,
  getTextractAnalysis,
} = require("../services/textractExpenseService");
const { formatDateAndGenerateCategory } = require("../services/chatGPT");
const { uploadFileToS3, readFileFromS3 } = require("../services/s3Service");
const xlsx = require("xlsx");
const User = require("../schemas/userSchema");


const createSpreadsheet = asyncHandler(async(req, res) => {
  let { spreadsheetName } = req.body;
  try {
    const user = await User.findById(req.session.user.id);
    user.spreadsheets.push({
      name: spreadsheetName,
      expenses: [],
    });
    await user.save();
    res.json(user.spreadsheets[user.spreadsheets.length - 1]);
  } catch (error) {
    console.error("Error processing files:", error);
    res
      .status(500)
      .json({ message: error.message });
  }
})

const uploadExpenses = asyncHandler(async(req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  let { spreadsheetId } = req.body;
  const bucketName = "accounting-ai-td";
  const usersFilesDir = path.join(__dirname, "..", "usersFiles");

  // Ensure the directory exists
  if (!fs.existsSync(usersFilesDir)) {
    fs.mkdirSync(usersFilesDir, { recursive: true });
  }

  try {
    const user = await User.findById(req.session.user.id);

    // Create a new spreadsheet if one doesn't exist
    if (!spreadsheetId) {
      const newSpreadsheet = {
        name: `Spreadsheet ${new Date().toISOString()}`,
        expenses: [],
      };
      user.spreadsheets.push(newSpreadsheet);
      await user.save();
      spreadsheetId = user.spreadsheets[user.spreadsheets.length - 1]._id;
    }

    const processedResults = await Promise.all(
      req.files.map(async (file) => {
        const fileBuffer = file.buffer;

        // Determine the number of pages in the PDF
        let numPages;
        await pdf(fileBuffer).then(function (data) {
          numPages = data.numpages;
        });

        const { fileKey } = await uploadFileToS3(bucketName, fileBuffer);

        // Write file to the usersFiles directory
        const filePath = path.join(usersFilesDir, `${fileKey}.pdf`);
        fs.writeFileSync(filePath, fileBuffer);

        let analyzedData;
        if (numPages > 1) {
          // Handle multi-page file
          const jobId = await startTextractAnalysis(bucketName, fileKey);
          analyzedData = await getTextractAnalysis(jobId);
        } else {
          // Handle single-page file or other simple files
          const analyzedFile = await analyzeExpenseDocument(
            bucketName,
            fileKey
          );
          analyzedData = analyzedFile ? [analyzedFile] : []; // Ensure analyzedData is an array
        }

        // Process each item in the analyzed data
        return Promise.all(
          analyzedData.map(async (dataItem) => {
            const processedResult = await formatDateAndGenerateCategory(
              dataItem,
              fileKey
            );
            processedResult._id = new mongoose.Types.ObjectId();
            await User.findOneAndUpdate(
              { _id: req.session.user.id, "spreadsheets._id": spreadsheetId },
              { $push: { "spreadsheets.$.expenses": processedResult } },
              { new: true }
            );
            return processedResult;
          })
        );
      })
    );

    // Flatten the array of arrays into a single array of results
    const flatResults = processedResults.flat();

    res.json({
      message: "Files processed and updated successfully",
      processedResults: flatResults,
    });
  } catch (error) {
    console.error("Error processing files:", error);
    res
      .status(500)
      .json({ message: error.message });
  }
})

const getSpreadsheet = asyncHandler(async(req, res) => {
  const { spreadsheetId } = req.params;
  try {
    const user = await User.findById(req.session.user.id);
    const spreadsheet = user.spreadsheets.id(spreadsheetId);
    res.json(spreadsheet);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: error.message });
  }
})

const readLocalFilePage = asyncHandler(async(req, res) => {
  const { fileName, filePage } = req.params;
  const filePath = path.join(__dirname, "..", "usersFiles", `${fileName}.pdf`);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    console.log("filename", fileName);
    console.log("filePage", filePage);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    if (filePage < 1 || filePage > pdfDoc.getPageCount()) {
      return res.status(404).json("Requested page not found.");
    }

    const singlePagePdf = await PDFDocument.create();
    const [extractedPage] = await singlePagePdf.copyPages(pdfDoc, [
      filePage - 1,
    ]);
    singlePagePdf.addPage(extractedPage);

    const singlePagePdfBytes = await singlePagePdf.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileName}-page-${filePage}.pdf"`
    );

    // Instead of sending the bytes, we stream them
    const readStream = new Readable();
    readStream._read = () => {}; // _read is required but you can noop it
    readStream.push(singlePagePdfBytes);
    readStream.push(null); // Indicates the end of the stream (EOF)

    readStream.pipe(res);
  } catch (error) {
    console.error("Error processing PDF file:", error);
    res.status(500).json({ message: error.message });
  }
})
function extractDecimals(data) {
  const regex = /(\d+(\.\d+)?)/g;
  let results = [];

  for (let item of data) {
    let cleanedString = item.replace(/[^\d.-\s]/g, "");
    if (cleanedString.includes(" ") && cleanedString.match(/\s\d+/g)) {
      cleanedString = cleanedString.replace(/\s+/g, ".");
    }
    let match = cleanedString.match(regex);
    if (match) {
      results.push(...match.map(Number));
    }
  }

  return results;
}

const parseNumbers = asyncHandler(async(req, res) => {
  const { spreadsheetId } = req.params;
  const numberFields = ["SUBTOTAL", "TAX", "TOTAL"];
  try {
    const user = await User.findById(req.session.user.id);
    const expenses = user.spreadsheets.id(spreadsheetId).expenses;
    for (let i = 0; i < expenses.length; i++) {
      for (let j = 0; j < numberFields.length; j++) {
        const field = numberFields[j];
        if (expenses[i][field] && expenses[i][field].text) {
          // Use extractDecimals to convert string to numbers
          let extractedNumbers = extractDecimals([expenses[i][field].text]);
          // Assign the first extracted number or 0 if none found to the .text field as a float
          expenses[i][field].text = extractedNumbers.length
            ? extractedNumbers[0]
            : 0;
        }
      }
    }
    await user.save(); // Save the updated user document
    res.json({ message: "Numbers parsed and updated successfully" });
  } catch (error) {
    console.error("Error parsing numbers:", error);
    res.status(500).json({ message: error.message});
  }
})

const downloadExpensesXLSX = asyncHandler(async(req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { selectedFields } = req.body;
    const user = await User.findById(req.session.user.id);
    if (!user || !user.spreadsheets.id(spreadsheetId)) {
      return res.status(404).json({ message: "Spreadsheet not found" });
    }

    const expenses = user.spreadsheets.id(spreadsheetId).expenses;
    if (expenses.length === 0) {
      return res.status(404).json({ message: "No items found" });
    }

    // Group expenses by the text in the CATEGORY field
    const categoryGroups = {};

    expenses.forEach((expense) => {
      const category = expense.CATEGORY.text; // Extract the category text
      if (!categoryGroups[category]) {
        categoryGroups[category] = [];
      }
      // Filter the expense fields based on selectedFields
      const filteredExpense = {};
      selectedFields.forEach((field) => {
        if (
          expense[field] &&
          typeof expense[field] === "object" &&
          "text" in expense[field]
        ) {
          filteredExpense[field] = expense[field].text;
        }
      });
      categoryGroups[category].push(filteredExpense);
    });

    // Create a new workbook
    const workbook = xlsx.utils.book_new();

    // Add a worksheet for each unique category found
    Object.keys(categoryGroups).forEach((category) => {
      const worksheet = xlsx.utils.json_to_sheet(categoryGroups[category]);
      xlsx.utils.book_append_sheet(workbook, worksheet, category); // Name the sheet after the category
    });

    // Write the Excel file to a buffer
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers to prompt download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Expenses.xlsx"'
    );
    res.json(buffer);
  } catch (error) {
    console.error("Error while downloading Excel file:", error);
    return res.status(500).json({ message: error.message });
  }
})


const deleteSpreadsheet = asyncHandler(async(req, res) => {
  const { spreadsheetId } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: req.session.user.id },
      { $pull: { spreadsheets: { _id: spreadsheetId } } }
    );
    res.json({ message: "Spreadsheet deleted successfully" });
  }
  catch (error) {
    console.error("Error deleting spreadsheet:", error);
    res.status(500).json({ message: error.message });
  }
})

module.exports = {
  uploadExpenses,
  createSpreadsheet,
  getSpreadsheet,
  readLocalFilePage,
  downloadExpensesXLSX,
  parseNumbers,
  deleteSpreadsheet,
}
