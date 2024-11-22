const express = require('express');
const router = express.Router();
const { showpage, uploadImage, undoEdit, redoEdit } = require('../controllers/editControllers');

// router.get('/', showpage)
router.post('/upload', uploadImage);
router.post('/undo/:id', undoEdit);
router.post('/redo/:id', redoEdit);

module.exports = router;