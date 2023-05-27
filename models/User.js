const mongoose = require('mongoose')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto') 

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide name'],
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        lowercase: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'  
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 6,
    },
    role: {
        type: String,
        enum:['admin', 'user'],
        default:'user'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date 
})

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

})

userSchema.methods.createJWT = function() {
    return jwt.sign({userId:this._id, name: this.name, email:this.email},
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME
        })
}

userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

userSchema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

    //console.log(resetToken, this.passwordResetToken)

    return resetToken
}


module.exports =  mongoose.model('Consumer', userSchema)