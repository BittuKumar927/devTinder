const express = require('express');
const User = require('../models/user.js');
const { userAuth } = require("../middlewares/auth.js"); // Import authentication middlewares
const ConnectionRequest = require('../models/connectionRequest.js'); // Import the connection request model

const USER_SAFE_DATA = "firstName lastName about photoUrl age gender skills";

const userRouter = express.Router();

// Get all the pending connection requests for the authenticated user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("formUserId", "firstName  lastName photoUrl gender skills"); 
        // can use this also .populate("formUserId", ["firstName", "lastName"]);
        // Populate the formUserId field with user data;

        //user is only getting the id not the person data

        res.json({
            message: "Connection requests fetched successfully",
            data: connectionRequests
        });

    }catch(err) {
        console.error("Error fetching connection requests:", err.message);
    }
});

// Get all users who are connected with you
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{

        const loggedInUser = req.user;

        //akshay => elon accepthed
        // elon => akshay accepted
        // dono possible hai isliye or wala use kiya hu

        // Find all connection requests where the logged-in user is either the sender or receiver
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { formUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate("formUserId", USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA); // Populate the formUserId field with user data

        const data = connectionRequests.map((row)=> {
            if(row.formUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId; // If the logged-in user is the sender, return the receiver's data
            } else {
                return row.formUserId; // If the logged-in user is the receiver, return the sender's data
            }
        }); 

        res.json({
            message: "Connected users fetched successfully",
            data: data
        });

    }catch(err) {
        console.error("Error fetching connected users:", err.message);
        return res.status(500).send("Error fetching connected users");
    }
});

module.exports = userRouter;