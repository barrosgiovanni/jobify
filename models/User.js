const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true, 'Please, provide a name.' ],
    minlength: [ 3, 'Name min. is 4 characters.' ],
    maxlength: [ 20, 'Name max. is 20 characters.' ],
    trim: true
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please, provide a valid email.'
    },
    required: [ true, 'Please, provide an email.' ]
  },
  password: {
    type: String,
    required: [ true, 'Please, provide a password.' ],
    minlength: [ 6, 'Password min. is 6 characters.' ],
    select: false
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'default'
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'Los Angeles, CA'
  }
});

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function() {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
