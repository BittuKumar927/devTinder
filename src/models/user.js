const mongoose = require('mongoose');
const validator = require('validator'); // ✅ import validator
const jwt = require('jsonwebtoken'); // ✅ Import jwt here to avoid circular dependency issues
const bcrypt = require('bcrypt'); // ✅ Import bcrypt for password hashing
// ✅ Use mongoose to define the user schema

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

userSchema.methods.getJWT = async function () {
  const user = this; // ✅ Use `this` to refer to the current user instance
  const token = jwt.sign({ _id: user._id}, 'DEV@Tinder@2343', {
    expiresIn: '7d',
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this; // ✅ Use `this` to refer to the current user instance

  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;

}

const User = mongoose.model('User', userSchema);
module.exports = User;
