const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { addGoal, getGoals, updateGoal, deleteGoal } = require('../controllers/goalController');

router.post('/add', protect, authorizeRoles('student'), addGoal);
router.get('/list/:portfolioId', protect, authorizeRoles('student', 'teacher', 'admin'), getGoals);
router.put('/update/:id', protect, authorizeRoles('student'), updateGoal);
router.delete('/delete/:id', protect, authorizeRoles('student'), deleteGoal);

module.exports = router;