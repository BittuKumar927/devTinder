const express = require('express');

const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const app = express();

app.post("/signup", async (req, res) => {
    const user = new User({
    firstName:"Raja", 
    lastName:"Kumar", 
    email:"raja@gmail.com", password:"raja123", 
    age: 28 
    });
    await user.save();
    res.send("User added successfully");
});


connectDB().then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(7777, () => {
    console.log('Server is running on port 7777');
    });
}).catch((err) => {
    console.error("Error connecting to MongoDB:");
});

