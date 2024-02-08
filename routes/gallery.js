const express = require('express');
const router = express.Router();

const { createImage, getImages, getImage } = require('../controllers/gallery');

router.route('/').post(createImage).get(getImages);
router.route('/:id').get(getImage);

module.exports = router;
