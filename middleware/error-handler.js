const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something Went Wrong!",
  };

  //! mongoose erros
  // Cast Error
  if (err.name && err.name === "CastError") {
    customError.message = `No job found of id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  // Duplication Error
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, Please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // Validation Error
  if (err.name && err.name === "ValidationError") {
    customError.message = `Validation Error: ${Object.values(err.errors)
      .map((item) => item.message)
      .join(",")}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  return res.status(customError.statusCode).json({ err: customError.message });
};

module.exports = errorHandlerMiddleware;
