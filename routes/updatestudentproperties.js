const express = require('express');
const router = express.Router();
const { updateAcademicCommitteeStatus, updateMatricNumber, updateStudentProfilesFromJson, promoteStudents, resetPasswordsToLastName } = require('../controllers/updatestudentproperties');

router.patch('/academiccommittee', updateAcademicCommitteeStatus);
router.patch('/matricnumber', updateMatricNumber);
router.patch('/profiles', updateStudentProfilesFromJson);
router.patch('/promote', promoteStudents);
router.patch('/resetpasswords', resetPasswordsToLastName);



module.exports = router