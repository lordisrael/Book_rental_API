const Book = require('../models/book')
const {StatusCodes} = require('http-status-codes')


const searchBooks = async (req, res) => {
    const {title, author, genre, sort, fields} = req.query
    const queryObject = {}

    if(title){
        queryObject.title = {$regex: title, $options: 'i'}
    }
    if(author){
        queryObject.author = {$regex: author, $options: 'i'}
    }
    if(genre){
        queryObject.genre = genre
    }
    let result = Book.find(queryObject)
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else{
        result = result.sort('id')
    }
    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const books = await result.select('title _id author')

    res.status(StatusCodes.OK).json({books, nbHits: books.length})

}

module.exports = {
    searchBooks
}