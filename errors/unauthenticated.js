const CustomAPIError = require('./custom-api');
const { StatusCodes } = require('http-status-codes');

class UnauthenticadedError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
};

module.exports = UnauthenticadedError;
