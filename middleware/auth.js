const { UnauthenticadedError } = require("../errors");
const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticadedError('Authentication failed.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = payload.userId === '64b6f72b7b77e04f2126415a';
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnauthenticadedError('Authentication failed.');
  }
};

module.exports = authenticateUser;
