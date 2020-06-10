const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminSchema = new mongoose.Schema({
        name: { type: String },
        email:{
            type:String,
            unique: true,
            required: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Email is not valid')
                }
            }
        },
        username:{
            type:String,
            unique: true,
            required: true,
        },
        password:{
            type: String,
            required: true,
            trim: true,
            minlength: 7,
            validate(value){
                if(value.includes('password')){
                    throw new Error('Your password must not include "password"');
                }
            }
        },
        avatar: {
            type: String
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
}, {
    timestamps: true
});



adminSchema.methods.toJSON = function(){
    const admin = this
    const adminObject = admin.toObject()
    delete adminObject.password
    delete adminObject.tokens

    return adminObject;
}

// Generating admin Token 
adminSchema.methods.generateAuthToken = async function(){
    const admin = this;
    const token = jwt.sign({ _id: admin._id.toString()}, process.env.JWT_SECRET);

    admin.tokens = admin.tokens.concat({ token });
    await admin.save();
    return token;
}


// Finding admin  y email and comparing hashed password Function for Login
adminSchema.statics.findByCredentials = async (email, password) =>{
    const admin = await Admin.findOne({email})
    if(!admin) throw new Error('Admin does not exist');

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) throw new Error('Wrong Email or Password, Try agin');

    return admin;
}


// Hashing the plain text password
adminSchema.pre('save', async function (next){
    const admin = this;
    if (admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next();
});


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;