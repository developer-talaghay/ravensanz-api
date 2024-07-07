const express = require('express');
const router = express.Router();
const writerController = require('../controllers/writerController');

// GET all writers
router.get('/', writerController.getAllWriters);

// GET writer by ID
router.get('/:id', writerController.getWriterById);

// PATCH writer
router.put('/:id', writerController.updateWriter);

// POST writer
router.post('/', writerController.createWriter);

// DELETE writer
router.delete('/:id', writerController.deleteWriter);

module.exports = router;
