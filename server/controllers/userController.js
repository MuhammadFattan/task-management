const Task = require("../models/Task");
const User = require("../models/User");

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "member" }).select("-password");

        // add task counts for each user
        const userWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTask = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
            const inProgressTask = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
            const completedTask = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

            return {
                ...user._doc, //include all wxisting user data
                pendingTask,
                inProgressTask,
                completedTask,
            };
        }));

        res.json(userWithTaskCounts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found!" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getUsers, getUserById };