const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const userAuth = async (req, res, next) => {
  try {
    // ✅ Correct way to extract token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send('Unauthorized: Invalid token');
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, 'DEV@Tinder@2343');

    // ✅ Find user by ID
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).send('Not a genuine user');
    }

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Error in user authentication:', err.message);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  userAuth,
};
