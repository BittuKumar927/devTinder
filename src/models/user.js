const mongoose = require('mongoose');
const validator = require('validator'); // ✅ import validator

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is not valid: ' + value);
        }
      },
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error('Password is not strong enough');
        }
      },
    },
    age: {
      type: Number,
      min: 18, // ✅ fix: use `min` for numbers
    },
    gender: {
      type: String,
      validate(value) {
        if (!['male', 'female', 'others'].includes(value)) {
          throw new Error('Gender data is not valid');
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        'https://th.bing.com/th/id/OIP.w0TcjC4y9CxTrY3sitYa_AAAAA?rs=1&pid=ImgDetMain',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Photo URL is not valid: ' + value);
        }
      },
    },
    about: {
      type: String,
      default: 'Default description provided',
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true, // ✅ Auto createdAt and updatedAt
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
