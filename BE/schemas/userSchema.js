const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseFieldSchema = new Schema({
  text: { type: String },
  confidence: { type: Number },
});

// Function to create a default expenseField
const defaultExpenseField = () => ({
  text: "", // Default text
  confidence: 0.0, // Default confidence
});

const expenseSchema = new mongoose.Schema({
  FILE_PAGE: { type: expenseFieldSchema, default: defaultExpenseField },
  FILE_NAME: { type: expenseFieldSchema, default: defaultExpenseField },
  INVOICE_RECEIPT_DATE: {
    type: expenseFieldSchema,
    default: defaultExpenseField,
  },
  VENDOR_NAME: { type: expenseFieldSchema, default: defaultExpenseField },
  VENDOR_ADDRESS: { type: expenseFieldSchema, default: defaultExpenseField },
  TOTAL: { type: expenseFieldSchema, default: defaultExpenseField },
  SUBTOTAL: { type: expenseFieldSchema, default: defaultExpenseField },
  TAX: { type: expenseFieldSchema, default: defaultExpenseField },
  VENDOR_PHONE: { type: expenseFieldSchema, default: defaultExpenseField },
  STREET: { type: expenseFieldSchema, default: defaultExpenseField },
  GRATUITY: { type: expenseFieldSchema, default: defaultExpenseField },
  CITY: { type: expenseFieldSchema, default: defaultExpenseField },
  STATE: { type: expenseFieldSchema, default: defaultExpenseField },
  COUNTRY: { type: expenseFieldSchema, default: defaultExpenseField },
  ZIP_CODE: { type: expenseFieldSchema, default: defaultExpenseField },
  CATEGORY: { type: expenseFieldSchema, default: defaultExpenseField },
});

const spreadsheetSchema = new Schema({
  name: { type: String, required: true }, // Assuming each spreadsheet has a name
  expenses: [expenseSchema], // Array of expenses
});

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    accessToken: { type: String, default: "", select: false },
    refreshToken: { type: String, default: "", select: false },
    password: { type: String, default: "", select: false },
    picture: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    spreadsheets: {
      type: [spreadsheetSchema],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: "text", lastName: "text", email: "text" });

const User = mongoose.model("User", userSchema);
module.exports = User;
