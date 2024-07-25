const WriterModel = require('../models/writerModel');

const writerController = {};

// GET all writers
writerController.getAllWriters = (req, res) => {
  const { searchQuery, order = 'ASC', page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  WriterModel.getAllWriters(searchQuery, order, limit, offset, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
};

// GET writer by ID
writerController.getWriterById = (req, res) => {
  const writerId = req.params.id;
  WriterModel.getWriterById(writerId, (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!result) {
      return res.status(404).json({ message: 'Writer not found' });
    }
    res.json(result);
  });
};

// PATCH writer
writerController.updateWriter = (req, res) => {
  const writerId = req.params.id;
  const updateData = req.body;
  WriterModel.updateWriter(writerId, updateData, (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ message: 'Writer updated successfully' });
  });
};

// POST writer
writerController.createWriter = (req, res) => {
  const newWriter = req.body;
  newWriter.isWriterVerified = 1; // Ensure the writer is verified
  WriterModel.createWriter(newWriter, (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(201).json({ message: 'Writer created successfully', writerId: result.insertId });
  });
};

// DELETE writer
writerController.deleteWriter = (req, res) => {
  const writerId = req.params.id;
  WriterModel.deleteWriter(writerId, (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ message: 'Writer deleted successfully' });
  });
};

module.exports = writerController;