const express = require('express');
const User = require('../models/user.js');
const {  userAuth } = require("../middlewares/auth.js"); // Import authentication middlewares
const ConnectionRequest = require('../models/connectionRequest.js'); // Import the connection request model

const requestRouter = express.Router();

//send connection request
requestRouter.post("/request/send/:status/:touserId", userAuth, async (req, res) => {
    try{

        const formUserId = req.user._id; // Get the ID of the user making the request

        const toUserId = req.params.touserId; // Get the ID of the user to whom the request is being sent

        const  status = req.params.status; // Get the status of the request (e.g., 'interested')

        const allowedStatuses = ['ignored', 'interested']; // Define allowed statuses

        if(!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status Type : " + status });
        }

        // check if there is already a connection request between the two users
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { formUserId: formUserId, toUserId: toUserId },
                { formUserId: toUserId, toUserId: formUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).json({ error: "Connection request already exists between these users" });
        }

        //verify if the user exists
        const toUser = await User.findById(toUserId);

        if (!toUser) {
            return res.status(404).json({ error: "User not found" });
        }


        const connectionRequest = new ConnectionRequest({
            formUserId: formUserId,
            toUserId: toUserId,
            status: status
        });

        const data = await connectionRequest.save(); // Save the connection request to the database

        if(status === 'interested') {
            // If the status is 'interested', update the user's interested status
        res.status(201).json({ message: "Connection request sent successfully" ,
        data: data }
        );}else{
            res.status(201).json({ message: "Ignored the profile successfully",
            data: data 
             });
        }

    }catch(err){
        console.error("Error in sending connection request:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//accepted or rejected api
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {   
        
        const loggedinUser = req.user;

        const requestId = req.params.requestId; // Get the ID of the connection request to be reviewed

        //validate the status
        const status = req.params.status;

        const allowedStatuses = ['accepted', 'rejected'];

        if(!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status Type : " + status });
        }
        
        // akshay => elon
        // loggedinUser._id => elon  toUserId
        // status = interested
        // request id should be valid

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedinUser._id, // Ensure the request belongs to the logged-in user
            status: 'interested' // Ensure the request is in 'interested' status
        });
        
        if(!connectionRequest) {
            return res.status(404).json({ error: "Connection request not found or already reviewed" });
        }

        connectionRequest.status = status; // Update the status of the connection request

        const updatedRequest = await connectionRequest.save(); // Save the updated connection request

        res.json({
            message: `Connection request ${status} successfully`,
            data: updatedRequest
        });



    }
    catch (err) {
        console.error("Error in reviewing connection request:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = requestRouter;