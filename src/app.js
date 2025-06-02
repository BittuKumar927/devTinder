const express = require('express');

const connectDB = require("./config/database.js");
const { validateSignUpData } = require("./utils/validation.js");
const User = require("./models/user.js");
const app = express();
const validator = require('validator'); // Import validator for validation
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const cookieParser = require('cookie-parser'); // Import cookie-parser for handling cookies
const {  userAuth } = require("./middlewares/auth.js"); // Import authentication middlewares

const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token handling


app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware to parse cookies 

//signup route
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid credentials");
        }
        // If everything is valid, send success response

        // You can also generate a token here if you are using JWT for authentication
        //Create a JWT token

        const token = await jwt.sign({_id: user._id}, "DEV@Tinder@2343");
        console.log("Token generated:", token);

        //set the token in a cookie
        res.cookie("token", token);

        res.send("Login successful");

    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).send("Internal server error");
    }
});

//Get user profile
app.get("/profile", userAuth, async (req, res) => {
    const user=req.user; // Assuming user is attached to req by userAuth middleware
    res.send(user);
    
});

//send connection request
app.post("/sendconnectionrequest", userAuth, async (req, res) => {
    console.log("Connection request received");

    res.send("Connection request sent successfully");
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
        const allowedUpdates = ["userId", 'lastName', 'password', 'age',"skills",'PhotoUrl'];

        // Check if the provided data contains only allowed updates
        const isUpdatesAllowed = Object.keys(data).every(key => allowedUpdates.includes(key));

        if( !isUpdatesAllowed) {
        res.status(400).send("Invalid updates provided");
        }
        if(data?.skills.length > 5) {
            return res.status(400).send("Skills array cannot exceed 5 items");
        }
        const user = await User.findByIdAndUpdate({_id:userId}, data,{
            returnDocument: 'after', // Return the updated document
            runValidators: true // Ensure that the update respects the schema validation
        });
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

