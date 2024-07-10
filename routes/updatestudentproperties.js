const express = require('express');
const router = express.Router();
const { updateAcademicCommitteeStatus, updateMatricNumber, updateStudentProfilesFromJson } = require('../controllers/updatestudentproperties');

router.patch('/academiccommittee', updateAcademicCommitteeStatus);
router.patch('/matricnumber', updateMatricNumber);
router.patch('/profiles', updateStudentProfilesFromJson);

module.exports = router