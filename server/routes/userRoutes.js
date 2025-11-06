const express = require('express');
const { protect, adminOnly } = require('../middleweres/authMiddlewere');
const { getUsers, getUserById, deleteUser } = require('../controllers/userController');

const router = express.Router();

// User management Routes
router.get("/", protect, adminOnly, getUsers); // get all users (admin only)
router.get("/", protect, getUserById); // get a specific user

module.exports = router;