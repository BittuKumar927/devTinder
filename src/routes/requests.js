const express = require('express');
const User = require('../models/user.js');
const {  userAuth } = require("../middlewares/auth.js"); // Import authentication middlewares
const ConnectionRequest = require('../models/connectionRequest.js'); // Import the connection request model

const requestRouter = express.Router();

//send connection request
requestRouter.post("/request/send/:status/:touserId", userAuth, async (req, res) => {
    try{

        const fromUserId = req.user._id; // Get the ID of the user making the request

        const toUserId = req.params.touserId; // Get the ID of the user to whom the request is being sent

        const  status = req.params.status; // Get the status of the request (e.g., 'interested')

        const allowedStatuses = ['ignored', 'interested']; // Define allowed statuses

        if(!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status Type : " + status });
        }

        // check if there is already a connection request between the two users
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { formUserId: fromUserId, toUserId: toUserId },
                { formUserId: toUserId, toUserId: fromUserId }
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
            formUserId: fromUserId,
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



module.exports = requestRouter;