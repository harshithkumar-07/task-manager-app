const Task = require('../models/Task');
const User = require('../models/User');

// Get tasks based on user role
const getTasks = async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === 'admin') {
      // Admin sees all tasks with user details
      tasks = await Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name email');
    } else {
      // Regular user sees only tasks assigned to them
      tasks = await Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email').populate('createdBy', 'name email');
    }
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create task (Admin only)
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    
    // Check if assigned user exists
    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user.id,
      status: status || 'pending',
    });
    
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is admin or assigned user
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }
    
    task.status = status;
    task.updatedAt = Date.now();
    await task.save();
    
    const updatedTask = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete task (Admin only)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete tasks' });
    }
    
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (for Admin to assign tasks)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTaskStatus, deleteTask, getUsers };