const express = require('express');
const { getTasks, createTask, updateTaskStatus, deleteTask, getUsers } = require('../controllers/taskController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

router.get('/tasks', getTasks);
router.post('/tasks', adminMiddleware, createTask);
router.put('/tasks/:id/status', updateTaskStatus);
router.delete('/tasks/:id', adminMiddleware, deleteTask);
router.get('/users', adminMiddleware, getUsers);

module.exports = router;