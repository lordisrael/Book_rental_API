const express = require('express')
const router = express.Router()

const { addBook, deleteBook, getUsers } = require('../controllers/admin-controller')

router.route('/book').post(addBook)
router.route('/book/:id').delete(deleteBook)
router.route('/users').get(getUsers)

module.exports = router