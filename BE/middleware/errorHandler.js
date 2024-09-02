class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    err = new ApiError(
      err.message || "Something went wrong",
      err.statusCode || 500
    );
  }

  console.error(err);

  const statusCode = err.statusCode || 500;
  const environment = process.env.NODE_ENV || "development";

  if (environment === "development") {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  if (environment === "production") {
    return res.status(statusCode).json({
      success: false,
      message: err.isOperational ? err.message : "Internal Server Error",
    });
  }
};

module.exports = { ApiError, errorHandler };
