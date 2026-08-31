const express = require('express');

const router = express.Router();

// Upload middleware
const upload = require('../middleware/uploadMiddleware');

// Authentication middleware
const { protect } = require('../middleware/authMiddleware');

// Document controller
const {
  uploadDocument,
  getUserDocuments
} = require('../controllers/docController');


// ========================================
// POST /api/documents
// Upload Medical Document
// ========================================
router.post(
  '/',
  protect,
  upload.single('file'),
  uploadDocument
);


// ========================================
// GET /api/documents
// Get Logged-in User Documents
// ========================================
router.get(
  '/',
  protect,
  getUserDocuments
);


module.exports = router;