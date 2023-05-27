const express = require('express')
const router = express.Router()

const { register, login, forgotPassword, logout, resetPassword } = require('../controllers/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/forgot',).post(forgotPassword)
router.route('/reset/:token').patch(resetPassword)
router.route('logout', logout)

module.exports = router