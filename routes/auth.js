const express = require('express')
const router = express.Router()
const { login, changePassword, resetPassword, changePasswordAndSecurityQuestion } = require('../controllers/auth');
// router.post('/register', register)
router.post('/login', login);
router.post('/changepw', changePassword);
router.post('/resetpw', resetPassword);
router.post('/cpasq', changePasswordAndSecurityQuestion);
// router.get('/getStudents', fetchAndStoreStudents)
// router.post('/populate', registerMultipleStudents)

module.exports = router