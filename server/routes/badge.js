const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { addBadge, getBadges, verifyBadge, deleteBadge, getBadgeCount } = require('../controllers/badgeController');

router.post('/add', protect, authorizeRoles('student'), addBadge);
router.get('/list/:portfolioId', protect, authorizeRoles('student', 'teacher', 'admin'), getBadges);
router.get('/count/:portfolioId', protect, authorizeRoles('student', 'teacher', 'admin'), getBadgeCount);
router.put('/verify/:id', protect, authorizeRoles('teacher', 'admin'), verifyBadge);
router.delete('/delete/:id', protect, authorizeRoles('student'), deleteBadge);

module.exports = router;