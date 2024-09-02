const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const expenseSchema = new mongoose.Schema({
  fileKey: { type: String, default: "" },
  transactionDate: { type: String, default: "" },
  company: { type: String, default: "" },
  vendorAddress: { type: String, default: "" },
  total: { type: Number, default: 0 },
  subtotal: { type: Number, default: 0 },
  totalTax: { type: Number, default: 0 },
  vendorPhone: { type: String, default: "" },
  street: { type: String, default: "" },
  gratuity: { type: Number, default: 0 },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "" },
  zipCode: { type: String, default: "" },
  category: { type: String, default: "" },
});

const spreadsheetSchema = new Schema({
  name: { type: String, required: true },  
  expenses: [expenseSchema], 
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
