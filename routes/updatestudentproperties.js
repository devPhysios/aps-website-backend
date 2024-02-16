const express = require('express');
const router = express.Router();
const { updateAcademicCommitteeStatus } = require('../controllers/updatestudentproperties');

router.patch('/academiccommittee', updateAcademicCommitteeStatus);

module.exports = router