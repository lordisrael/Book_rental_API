const express = require('express')
const router = express.Router()

const { searchBooks } = require('../controllers/search-controller')

router.route('/books').get(searchBooks)

module.exports = router