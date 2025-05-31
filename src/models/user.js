const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,// Ensure spaces to be trimmed at start and end
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid"+ value );
            }
        } // Custom validation for email format
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough");
            }
        } // Custom validation to ensure password does not contain the word 'password'
    },
    age: {
        type: Number,
        minlength: 18,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },//this is only called when entering new data in the databsse if correcting will not work like patch will not work.
    },
    photoUrl: {
        type: String,
        default: 'https://th.bing.com/th/id/OIP.w0TcjC4y9CxTrY3sitYa_AAAAA?rs=1&pid=ImgDetMain',
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Photo URL is not valid"+value);
        }
    },
    about: {
        type: String,
        default: 'Default decription provided',
    },
    skills: {
        type: [String],
    },
},{
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;