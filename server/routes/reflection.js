const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { addReflection, getReflectionForWork, updateReflection, listReflectionsByPortfolio } = require('../controllers/reflectionController');

router.post('/add', protect, authorizeRoles('student'), addReflection);
router.get('/work/:workId', protect, authorizeRoles('student', 'teacher', 'admin'), getReflectionForWork);
router.put('/update/:id', protect, authorizeRoles('student'), updateReflection);
router.get('/list-by-portfolio/:portfolioId', protect, authorizeRoles('student', 'teacher', 'admin'), listReflectionsByPortfolio);

module.exports = router;