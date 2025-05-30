
const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://stormshadow927:Bittu2343@namastenode.qg9mfun.mongodb.net/devTinder"
    );
};


module.exports = connectDB;