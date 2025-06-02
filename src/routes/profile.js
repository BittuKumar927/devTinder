const express = require('express');
const User = require('../models/user.js');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const {  userAuth } = require("../middlewares/auth.js"); // Import authentication middlewares
const { validateSignUpData } = require('../utils/validation.js');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token handling

const profileRouter = express.Router();

//Get user profile
profileRouter.get("/profile", userAuth, async (req, res) => {
    const user=req.user; // Assuming user is attached to req by userAuth middleware
    res.send(user);
    
});


module.exports = profileRouter;