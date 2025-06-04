const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    formUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User" // Reference to the User model
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User" // Reference to the User model
    },
    status: {
        type: String,
        required: true,
        enum: ['ignored', 'accepted', 'rejected', 'interested'],
        message:`{VALUE} is not a valid status`,
    }
},{
    timestamps: true
});

connectionRequestSchema.index({ formUserId: 1, toUserId : 1});// Create a compound index on formUserId and toUserId for faster lookups



connectionRequestSchema.pre('save', function(next){
    const connectionRequest = this;

    //formUserId and toUserId should not be the same
    if (connectionRequest.formUserId.toString() === connectionRequest.toUserId.toString()) {
        throw new Error("You cannot send a connection request to yourself");
    }
    next();// Call next to continue the save operation

});


const connectionRequestModel = new mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = connectionRequestModel;
// This model defines the structure for connection requests in the database.