const express = require('express');
const router = express.Router();
const { login, changePassword, resetPassword, changePasswordAndSecurityQuestion, registerMultipleStudents } = require('../controllers/auth');
const verifyToken = require('../middleware/authentication')
// router.post('/register', register)
router.post('/login', login);
router.post('/changepw', verifyToken, changePassword);
router.post('/resetpw', verifyToken, resetPassword);
router.post('/cpasq', verifyToken, changePasswordAndSecurityQuestion);
// router.get('/getStudents', fetchAndStoreStudents)
router.post('/populate', registerMultipleStudents)

module.exports = router