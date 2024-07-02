const ReaderModel = require('../models/readerModel');

const readerController = {};

// GET all readers
readerController.getAllReaders = (req, res) => {
  ReaderModel.getAllReaders((error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
};

// GET reader by ID
readerController.getReaderById = (req, res) => {
  const readerId = req.params.id;
  ReaderModel.getReaderById(readerId, (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!result) {
      return res.status(404).json({ message: 'Reader not found' });
    }
    res.json(result);
  });
};

// PATCH reader
readerController.updateReader = (req, res) => {
  const readerId = req.params.id;
  const updateData = req.body;
  ReaderModel.updateReader(readerId, updateData, (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ message: 'Reader updated successfully' });
  });
};

// POST reader
readerController.createReader = (req, res) => {
  const newReader = req.body;
  ReaderModel.createReader(newReader, (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(201).json({ message: 'Reader created successfully', readerId: result.insertId });
  });
};

// DELETE reader
readerController.deleteReader = (req, res) => {
  const readerId = req.params.id;
  ReaderModel.deleteReader(readerId, (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ message: 'Reader deleted successfully' });
  });
};

module.exports = readerController;