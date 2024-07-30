const AuthorWingsPurchasesModel = require("../models/authorWingsPurchasesModel");

const AuthorWingsPurchasesController = {};

// Get all rows or filter by authorId
AuthorWingsPurchasesController.getAll = (req, res) => {
  const { authorId } = req.query;

  AuthorWingsPurchasesModel.getAll(authorId, (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
};

// Update status
AuthorWingsPurchasesController.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['in review', 'pending payment', 'paid'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  AuthorWingsPurchasesModel.updateStatus(id, status, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json({ message: "Status updated successfully" });
  });
};

// Delete a row
AuthorWingsPurchasesController.delete = (req, res) => {
  const { id } = req.params;

  AuthorWingsPurchasesModel.delete(id, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json({ message: "Row deleted successfully" });
  });
};

module.exports = AuthorWingsPurchasesController;