const express = require("express");
const { createUser, getUserById } = require("../controllers/userController");
const {
  getUserRegistrations,
} = require("../controllers/registrationController");

const router = express.Router();

router.post("/", createUser);
router.get("/:userId", getUserById);
router.get("/:userId/registrations", getUserRegistrations);

module.exports = router;
