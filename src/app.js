const express = require('express');

const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {

    console.log("Received request to /signup with body:", req.body);

    const user = new User(req.body);

    try{
    await user.save();
    res.send("User added successfully");
    } catch(err) {
        console.error("Error saving user:", err);
        res.status(500).send("Error saving user");
    }
});


connectDB().then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(7777, () => {
    console.log('Server is running on port 7777');
    });
}).catch((err) => {
    console.error("Error connecting to MongoDB:");
});

