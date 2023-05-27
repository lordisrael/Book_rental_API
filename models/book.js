const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    id:{
        type: Number,
        unique: true
    },
    title:{
        type: String,
        required: [true, 'please provide book name']
    },
    author:{
        type: String,
        required: [true, 'please provide author name']    
    },
    publication_year: {
        type: Number
    },
    genre:{
        type: String,
        enum: {
            values:['Fiction', 'Children', 'Romance', 'Fantasy', 'Adventure', 'Epic', 'Mystery', 'Horror', 'Thriller'],
            message:'{VALUE} not found'
        }
    },
    isbn: {
        type: Number
    },
    // createdBy: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'User',
    //     required:[true, 'Please provide user']
    // }
}, {timestamps: true})

module.exports = mongoose.model('Book', bookSchema)