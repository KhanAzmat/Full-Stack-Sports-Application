class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    //super.message=message
    this.message=message
    this.name=message
    this.statusText=message
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
