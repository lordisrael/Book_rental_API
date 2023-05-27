const Book = require('../models/book')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')

const getUsers = async(req, res) => {
    const users = await User.find()
    res.status(StatusCodes.OK).json({users})
}

const addBook = async(req, res) => {

    /*const idAlreadyExists = await Book.findOne({id})
    if(idAlreadyExists){
        throw new BadRequestError('Book already exists')
    }
    */
    const book = await Book.create(req.body)
    if(!book){
        throw new BadRequestError(' Fill all information')
    }
    res.status(StatusCodes.CREATED).json({book})
}
const deleteBook = async(req, res) => {
    const {id: BookID} = req.params
    const book = await Book.findOneAndDelete({_id: BookID})
    if(!book){
        throw new NotFoundError(`No book with this id: ${BookID}`)
    }
    res.status(StatusCodes.OK).json({book, msg: 'Book deleted'})

}

module.exports= {
    addBook,
    deleteBook,
    getUsers
}