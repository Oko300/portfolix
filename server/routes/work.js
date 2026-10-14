const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { uploadCloud } = require('../middleware/cloudinary');
const { uploadWork, getWorks, updateWork, deleteWork } = require('../controllers/workController');

// Helper to catch multer errors and return clean JSON
const handleMulter = (middleware) => (req, res, next) => {
  middleware(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message || 'File upload error' });
    }
    next();
  });
};

router.post(
  '/upload',
  protect,
  authorizeRoles('student'),
  handleMulter(uploadCloud.single('file')),
  uploadWork
);

router.get(
  '/list/:portfolioId',
  protect,
  authorizeRoles('student', 'teacher', 'admin'),
  getWorks
);

router.put(
  '/update/:id',
  protect,
  authorizeRoles('student'),
  handleMulter(uploadCloud.single('file')),
  updateWork
);

router.delete(
  '/delete/:id',
  protect,
  authorizeRoles('student'),
  deleteWork
);

module.exports = router;
