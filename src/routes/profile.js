const express = require('express');
const User = require('../models/user.js');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const {  userAuth } = require("../middlewares/auth.js"); // Import authentication middlewares
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token handling
const { validateSignUpData, validateEditProifileData } = require('../utils/validation.js'); // Import validation utility
const profileRouter = express.Router();

//Get user profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    const user=req.user; // Assuming user is attached to req by userAuth middleware
    res.send(user);
    
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    
    try{
        const user = req.user; // Assuming user is attached to req by userAuth middleware
        
        if(!validateEditProifileData(req)) {
            return res.status(400).send("Invalid Edit Retuest");
        }

        const loggedInUser = req.user; // Get the logged-in user from the userAuth

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key]; // Update the user object with the new data
        });

        res.json({message:`${loggedInUser.firstName}, Profile updated successfully`,
        data: loggedInUser});


    
    }catch (err) {
        console.error("Error updating profile:", err.message);
        return res.status(400).send(err.message);
    }
});
    


module.exports = profileRouter;