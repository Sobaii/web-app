require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middleware/errorHandler");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/oAuthRoutes");

const app = express();
app.use(cookieParser());

// Security middleware
app.use(helmet());

// Body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "http://localhost:3001"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Session middleware
app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collection: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

// Rate limiting middleware
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // Limit each IP to 120 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use(rateLimiter);

// Routes
app.use("/expenses", expenseRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// Error handling middleware should be last
app.use(errorHandler);

// Database connection and server initialization
const PORT = process.env.PORT || 3000;
const dbURI = process.env.MONGODB_URI;

mongoose
  .connect(dbURI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.log(err));
