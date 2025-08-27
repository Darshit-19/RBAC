const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {updateUser} = require('../controllers/authController')

const router = express.Router();

// Only admin
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome Admin" });
});

// Admin or manager
router.get("/manager", verifyToken, authorizeRoles("admin", "manager"), (req, res) => {
  res.status(200).json({ message: "Welcome Manager" });
});

// Admin, manager, or user
router.get("/user", verifyToken, authorizeRoles("admin", "manager", "user"), (req, res) => {
  res.status(200).json({ message: "Welcome User" });
});

//Update user details (only admin can do)
router.put("/update/:id", verifyToken ,authorizeRoles("admin"),updateUser)


module.exports = router;
