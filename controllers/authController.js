const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticadedError } = require('../errors');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)  {
    throw new BadRequestError('You must fill out all fields to proceed.');
  }

  const userAlreadyExists = await User.findOne({ email });

  if (userAlreadyExists) {
    throw new BadRequestError('User already exists.');
  }

  const user = await User.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    name: user.name,
    email: user.email,
    lastName: user.lastName,
    location: user.location,
    token: token
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please, provide all values.');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new UnauthenticadedError('Invalid credentials.');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticadedError('Invalid credentials.');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    name: user.name,
    email: user.email,
    lastName: user.lastName,
    location: user.location,
    token: token
  });
};

const updateUser = async (req, res) => {
  const { name, email, lastName, location } = req.body;

  if (!name || !email || !lastName || !location) {
    throw new BadRequestError('Please, provide all values.');
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.name = name;
  user.email = email;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location
  });
};

module.exports = {
  register,
  login,
  updateUser
};
