const express = require('express');

const app = express();

const {adminAuth , userAuth} = require('./middlewares/auth');

app.use("/admin", adminAuth);



app.get('/user', userAuth, (req, res) => {
    try{
        throw new Error('This is an error from user route');
        res.send('User data is sent');
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).send('Something broke!');
    }
});

// app.use("/user", userAuth , (err, req, res, next) => {
//     if(err) {
//         console.error('Error occurred:', err.message);
//         res.status(400).send('Something broke!');
//     }
// });

app.get('/admin/getalldata', (req, res) => {
    res.send('All userData is sent');
});

app.get('/admin/deleteuser', (req, res) => {
    res.send('Deleted the user');
});

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});
