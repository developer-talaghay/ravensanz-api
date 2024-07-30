const express = require('express');
const router = express.Router();
const AuthorWingsPurchasesController = require('../controllers/authorWingsPurchasesController');

// Get all rows from author_wings_purchases or filter by authorId
router.get('/', AuthorWingsPurchasesController.getAll);

// Update status of a specific row
router.patch('/:id/status', AuthorWingsPurchasesController.updateStatus);

// Delete a specific row
router.delete('/:id', AuthorWingsPurchasesController.delete);

module.exports = router;