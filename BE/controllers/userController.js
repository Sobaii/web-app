const asyncHandler = require("express-async-handler");
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt");

const authenticateUser = asyncHandler(async (req, res) => {
  if (req.session.user.id) {
    const user = await User.findById(req.session.user.id);
    res.send(user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

const createUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      ) ||
      !email
    ) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    const user = await User.create({
      email,
      password,
    });
    req.session.user.id = user._id;
    return res.json({ message: "Signed up successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      req.session.user.id = user._id;
      res.json({ message: "Login successful" });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to log out" });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      res.status(300).json({ message: "No active session" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findUserById(userId);

    if (!user) {
      res.status(400).json({ message: `User ${userId} not found` });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const updateUserExpense = asyncHandler(async (req, res) => {
  const { expenses, spreadsheetId } = req.body;
  const user = await User.findById(req.session.user.id);
  try {
    const spreadsheet = user.spreadsheets.id(spreadsheetId);

    if (!spreadsheet) {
      res.status(404).json({ message: "Spreadsheet not found" });
      return;
    }

    spreadsheet.expenses = expenses;
    await user.save();
    res.status(200).json(spreadsheet.expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateUserSpreadsheetName = asyncHandler(async (req, res) => {
  const { name, spreadsheetId } = req.body;
  const user = await User.findById(req.session.user.id);
  try {
    const spreadsheet = user.spreadsheets.id(spreadsheetId);

    if (!spreadsheet) {
      res.status(404).json({ message: "Spreadsheet not found" });
      return;
    }

    spreadsheet.name = name;
    await user.save();
    res.status(200).json(spreadsheet.name);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const getUserSpreadsheetsInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.session.user.id);
  try {
    user.populate({
      path: "spreadsheets",
      populate: {
        path: "expenses",
        options: { limit: 10 },
      },
    });
    const spreadsheetInfo = user.spreadsheets.map((spreadsheet) => ({
      name: spreadsheet.name,
      id: spreadsheet._id,
      numberOfExpenses: spreadsheet.expenses.length,
      confidenceOverview: spreadsheet.expenses.slice(0, 10),
    }));
    res.status(200).json(spreadsheetInfo);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = {
  authenticateUser,
  createUser,
  updateUser,
  loginUser,
  logoutUser,
  updateUserExpense,
  getUserSpreadsheetsInfo,
  updateUserSpreadsheetName,
};
