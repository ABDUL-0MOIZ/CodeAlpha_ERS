const Event = require("../models/Event");
const Registration = require("../models/Registration");

const listEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ startDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

const getEventDetails = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const activeRegistrations = await Registration.countDocuments({
      event: event._id,
      status: "active",
    });

    res.status(200).json({
      ...event.toObject(),
      activeRegistrations,
      seatsLeft: Math.max(event.capacity - activeRegistrations, 0),
    });
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      startDate,
      endDate,
      capacity,
      createdBy,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !startDate ||
      !endDate ||
      !capacity
    ) {
      return res.status(400).json({ message: "Missing required event fields" });
    }

    const event = await Event.create({
      title,
      description,
      location,
      startDate,
      endDate,
      capacity,
      createdBy,
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listEvents,
  getEventDetails,
  createEvent,
};
