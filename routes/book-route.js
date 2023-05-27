const express = require('express')
const router = express.Router()

const { getAllBooks, getSingleBook } = require('../controllers/book-controller')

router.route('/').get(getAllBooks)
router.route('/:id').post(getSingleBook)

module.exports = router