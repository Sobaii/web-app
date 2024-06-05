// types/index.d.ts

// Define the types for ExpenseField, Expense, and Spreadsheet
export interface ExpenseField {
  text: string;
  confidence: number;
}

export interface Expense {
  FILE_PAGE: ExpenseField;
  FILE_NAME: ExpenseField;
  INVOICE_RECEIPT_DATE: ExpenseField;
  VENDOR_NAME: ExpenseField;
  VENDOR_ADDRESS: ExpenseField;
  TOTAL: ExpenseField;
  SUBTOTAL: ExpenseField;
  TAX: ExpenseField;
  VENDOR_PHONE: ExpenseField;
  STREET: ExpenseField;
  GRATUITY: ExpenseField;
  CITY: ExpenseField;
  STATE: ExpenseField;
  COUNTRY: ExpenseField;
  ZIP_CODE: ExpenseField;
  CATEGORY: ExpenseField;
}

export interface Spreadsheet {
  name: string;
  expenses: Expense[];
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}
