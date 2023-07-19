const BadRequestError = require('./bad-request');
const NotFoundError = require('./not-found');
const UnauthenticadedError = require('./unauthenticated');
const UnauthorizedError = require('./unauthorized');

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthenticadedError,
  UnauthorizedError
};
