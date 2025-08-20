const exprees = require('express')
const { register, login } = require('../controllers/authController')

const router  = exprees.Router()

router.post('/register', register)
router.post('/login', login)

module.exports = router