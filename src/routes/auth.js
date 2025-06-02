const express = require('express');
const User = require('../models/user.js');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const validator = require('validator'); // Import validator for validation
const { validateSignUpData } = require('../utils/validation.js');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token handling

const authRouter = express.Router();

//signup route
authRouter.post("/signup", async (req, res) => {
    //Validation of data
    try{
        validateSignUpData(req);
        const { firstName, lastName, email, password, age, gender, skills } = req.body;

    //encrypt password
        const passwordHash = await bcrypt.hash(req.body.password, 10); 

    //creating the user
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            gender,
            age});
        await user.save();
        res.send("User added successfully");

    }catch (err) {
        console.error("Validation error:", err.message);
        return res.status(400).send(err.message);
    }
});

//Login route
authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        //validation of email
        if(validator.isEmail(email) === false) {
            return res.status(400).send("Email is not valid");
        }

        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send("Invalid credentials");
        }

        //password validation
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid credentials");
        }
        // If everything is valid, send success response

        // You can also generate a token here if you are using JWT for authentication
        //Create a JWT token

        const token = await user.getJWT();
        console.log("Token generated:", token);

        //set the token in a cookie
        res.cookie("token", token); // Set the token in a cookie with httpOnly and secure flags

        res.send("Login successful");

    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).send("Internal server error");
    }
});


module.exports = authRouter;
