const { UnauthorizedError } = require('../errors');

const checkUserPermission = (requestUser, resourceUserId) => {

  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthorizedError('Not authorized to access this route.');
}

module.exports = checkUserPermission;
