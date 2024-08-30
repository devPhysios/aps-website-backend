const express = require('express');
const router = express.Router();
const { updateExecutives, updateSenators, fetchOfficers } = require('../controllers/leaders');

router.post('/officers', fetchOfficers);
router.patch('/executives', updateExecutives);
router.patch('/senators', updateSenators);


module.exports = router