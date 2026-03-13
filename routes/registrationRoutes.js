const express = require("express");
const {
  createRegistration,
  cancelRegistration,
} = require("../controllers/registrationController");

const router = express.Router();

router.post("/", createRegistration);
router.delete("/:id", cancelRegistration);

module.exports = router;
