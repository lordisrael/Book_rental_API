require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const authRoute = require('./routes/auth-routes')
const bookRoute = require('./routes/book-route')
const searchRoute = require('./routes/search-routes')
const adminRoute = require('./routes/admin-routes')

app.use(express.json())

//middleware
const authenticateUser = require('./middleware/authenticated')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const isAdmin = require('./middleware/isAdmin')
//DB
const connectDB = require('./db/connect')

//routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/admin', authenticateUser, isAdmin, adminRoute)
app.use('/api/v1/search',authenticateUser, searchRoute)
app.use('/api/v1/book',authenticateUser, bookRoute)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()