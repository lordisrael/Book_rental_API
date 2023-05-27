require('dotenv').config()
const fs = require('fs')

const connectDB = require('./db/connect')
const Book = require('./models/book')
//const jsonBook = require('./books.json')

const jsonBook = JSON.parse(fs.readFileSync('./books.json', 'utf-8'))

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Book.deleteMany()
        await Book.create(jsonBook)
        console.log('Success')
    } catch (error) {
        console.log(error)
    }
}

start()