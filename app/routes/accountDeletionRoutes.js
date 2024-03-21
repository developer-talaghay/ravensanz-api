const express = require('express');
const router = express.Router();
const accountDeletionController = require('../controllers/accountDeletionController');

router.post("/login", accountDeletionController.login);
router.get("/page", accountDeletionController.renderAccountDeletionPage);
router.get("/", accountDeletionController.renderAccountDeletionLogin);
router.post("/deleteuser", accountDeletionController.deleteUserInsertFeedback);

module.exports = router;