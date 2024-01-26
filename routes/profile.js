const express = require('express');
const router = express.Router();

const { updateStudent } = require('../controllers/profile');

router.route("/:id").patch(updateStudent);
// router.post('/login', login)

module.exports = router