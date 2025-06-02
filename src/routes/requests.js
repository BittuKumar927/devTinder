const express = require('express');
const User = require('../models/user.js');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const {  userAuth } = require("../middlewares/auth.js"); // Import authentication middlewares
const { validateSignUpData } = require('../utils/validation.js');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token handling

const requestgRouter = express.Router();

//send connection request
requestgRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
    console.log("Connection request received");

    res.send("Connection request sent successfully");
});


module.exports = requestgRouter;