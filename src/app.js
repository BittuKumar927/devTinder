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

//Get user by email
app.get("/user",async (req, res) => {
    const userEmail = req.body.email;
    try {
        const user = await User.findOne({email: userEmail});
        if (user.length === 0) {
            res.status(404).send("User not found");
        }else{
            res.send(user);
        }
    }catch(err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Error fetching user");
    }
});

//feed api for to get all users from database
app.get("/feed", async (req, res) => {
try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("No users found");
        } else {
            res.send(users);
        }
    } catch (err) {
        console.error("Error fetching users:", err);
    }
    
});

//Delete user by ID
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send("User deleted successfully");
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("Error deleting user");
    }
});

//Update user by ID
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate({_id:userId}, data);
        res.send("User updated successfully");
    } catch(err) {
        console.error("Error updating user:", err);
        res.status(500).send("Error updating user");
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

