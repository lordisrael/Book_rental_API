const {StatusCodes} = require('http-status-codes')
const CustomAPIError = require('../errors/custom-api')
const errorHandlerMiddleware = (err, req, res, next) => {
    let customError ={
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, please try again'
    }
    if(err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({msg: err.message})
    }
    if(err.name = 'ValidationError'){
        customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
        customError.statusCode = 400
    }
    
    return res.status(customError.statusCode).json({msg: customError.msg})
}
module.exports = errorHandlerMiddleware