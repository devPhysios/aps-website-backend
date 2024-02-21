const express = require('express');
const router = express.Router();

const { createImage, getImages, getImage, dummyRequest } = require('../controllers/gallery');

router.route('/').post(createImage).get(getImages);
router.route('/:id').get(getImage);
router.route('/request/dummy').get(dummyRequest);

module.exports = router;
