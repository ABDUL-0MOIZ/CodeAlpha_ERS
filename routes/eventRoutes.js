const express = require("express");
const {
  listEvents,
  getEventDetails,
  createEvent,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/", listEvents);
router.get("/:id", getEventDetails);
router.post("/", createEvent);

module.exports = router;
