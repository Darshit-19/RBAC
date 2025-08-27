const exprees = require('express')
const { register, login, verifyOtp } = require('../controllers/authController')

const router  = exprees.Router()

router.post('/signup', register)
router.post('/login', login)
router.post('/verify-otp', verifyOtp)

module.exports = router