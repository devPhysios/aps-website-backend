const express = require('express');
const router = express.Router();
const { createAlumni, getAllAlumni } = require('../controllers/alumnus');

router.post('/create', createAlumni);
router.get('/all', getAllAlumni);

module.exports = router;