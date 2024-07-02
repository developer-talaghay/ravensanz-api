const express = require('express');
const router = express.Router();
const readerController = require('../controllers/readerController');

// GET all readers
router.get('/', readerController.getAllReaders);

// GET reader by ID
router.get('/:id', readerController.getReaderById);

// PATCH reader
router.patch('/:id', readerController.updateReader);

// POST reader
router.post('/', readerController.createReader);

// DELETE reader
router.delete('/:id', readerController.deleteReader);

module.exports = router;