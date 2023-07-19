const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (error, req, res, next) => {

  const defaultError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: error.message || 'Something went wrong. Please, try again later.'
  };

  if (error.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(error.errors)
      .map((item) => item.message)
      .join(' ')
  }

  if (error.code && error.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${error.keyValue.email} is already registered in our database.`;
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

module.exports = errorHandlerMiddleware;
