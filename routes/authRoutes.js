const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');
const testUser = require('../middleware/test-user');

const {
  register,
  login,
  updateUser
} = require('../controllers/authController');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateUser').patch(authenticateUser, testUser, updateUser);

module.exports = router;
