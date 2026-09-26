const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { uploadCloud } = require('../middleware/cloudinary');
const { uploadWork, getWorks, updateWork, deleteWork } = require('../controllers/workController');

router.post('/upload', protect, authorizeRoles('student'), uploadCloud.single('file'), uploadWork);
router.get('/list/:portfolioId', protect, authorizeRoles('student', 'teacher', 'admin'), getWorks);
router.put('/update/:id', protect, authorizeRoles('student'), updateWork);
router.delete('/delete/:id', protect, authorizeRoles('student'), deleteWork);

module.exports = router;