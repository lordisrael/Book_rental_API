const User = require('../models/User')
const { UnauthenticatedError } = require('../errors')
const isAdmin = async (req, res, next) =>{
    //console.log(req.user)// debug
    const {email} = req.user 
    const adminUser = await User.findOne({ email })

    if(adminUser.role != 'admin'){
        throw new UnauthenticatedError('You are not an admin')
    } else {
         next()
    }
   
}   

module.exports = isAdmin