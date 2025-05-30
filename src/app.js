const express = require('express');

const app = express();

app.use("/hello", (req, res) => {
    res.send("Hello From hello route");
});

app.use("/test", (req, res) => {
    res.send("Hello from the server");
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});
