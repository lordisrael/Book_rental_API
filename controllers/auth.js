const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError} = require('../errors')
const crypto = require('crypto')
const sendEmail = require('../utils/email')

const register = async(req, res) => {
    const { name, email, password } = req.body

    const emailAlreadyExists = await User.findOne({email})
    if(emailAlreadyExists){
        throw new BadRequestError('Email already exists')
    }

const user = await User.create({...req.body/*name, email, password*/})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token})
}
const login = async(req, res) => {
    const {email, password } = req.body 
    if(!email || !password) {
        throw new BadRequestError('Please provide name and password')
    }
    const user = await User.findOne({email})
    if(!user) {
        throw new UnauthenticatedError('Provide Valid Crendentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Provide Valid Crendentials')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.name}, token})

} 
const forgotPassword = async(req, res) => {
    const{email} = req.body
    const user = await User.findOne({email})
    if(!user) {
        throw new NotFoundError('No User with given email')
    }
    const resetToken = user.createResetPasswordToken()
    await user.save()

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset/${resetToken}`
    const msg = `We have recieved a password reset request, Please use the below link to reset your password\n\n${resetUrl}\n\nThis reset pass word link expires in 10 minutes`

    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password change request received',
            message: msg
        })
        res.status(StatusCodes.OK).json({
            status: 'success',
            msg: 'Reset link send to the user'
        })
        
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        user.save()
        
        throw new UnauthenticatedError('There was error sending password reset token ')
    }
    
}
const resetPassword = async (req, res) => {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}})
    if(!user){
        throw new NotFoundError('Token is invalid, or expires')
    }
    user.password = req.body.password
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined
    user.passwordChangedAt = Date.now()

    user.save()
    const tokenJWT = user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.name}, tokenJWT})

}
const logout = async(req, res) => {

}
module.exports = {
    register, 
    login,
    logout,
    forgotPassword,
    resetPassword
}
