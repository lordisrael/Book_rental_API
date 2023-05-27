const Book = require('../models/book')
const {StatusCodes} = require('http-status-codes')
const { NotFoundError } = require('../errors')

const getAllBooks = async(req, res) => {
    const books = await Book.find().sort('id').select('title _id author')
    res.status(StatusCodes.OK).json({books, nbHits: books.length})
}

const getSingleBook = async(req, res) => {
    const { id: bookID} = req.params
    const book = await Book.findOne({_id: bookID})
    if(!book){
        throw new NotFoundError(`No book with this id: ${bookID}`)
    }
    res.status(StatusCodes.OK).json({book})
}
module.exports = {
    getAllBooks,
    getSingleBook
}