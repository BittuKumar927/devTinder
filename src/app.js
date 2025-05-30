const express = require('express');

const app = express();

//this will match only GET requests
app.get("/user",(req, res) => {
    res.send({firstname: "John", lastname: "Doe"});
});

//this will match only POST requests
app.post("/user", (req, res) => {
    res.send("saved user information successfully");
});

//this eill be use to delete the user
app.delete("/user", (req, res) => {
    res.send("deleted user information successfully");
});

//this will match all the http methods
app.use("/test", (req, res) => {
    res.send("Hello from the server");
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});
