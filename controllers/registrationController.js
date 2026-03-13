const Event = require("../models/Event");
const User = require("../models/User");
const Registration = require("../models/Registration");

const createRegistration = async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res
        .status(400)
        .json({ message: "userId and eventId are required" });
    }

    const [user, event] = await Promise.all([
      User.findById(userId),
      Event.findById(eventId),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const activeCount = await Registration.countDocuments({
      event: event._id,
      status: "active",
    });

    if (activeCount >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    let registration;
    try {
      registration = await Registration.create({
        user: userId,
        event: eventId,
      });
    } catch (error) {
      if (error && error.code === 11000) {
        return res
          .status(409)
          .json({ message: "User is already registered for this event" });
      }
      throw error;
    }

    const populated = await registration.populate([
      { path: "user", select: "name email role" },
      { path: "event", select: "title location startDate endDate" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const getUserRegistrations = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const registrations = await Registration.find({ user: userId })
      .populate(
        "event",
        "title description location startDate endDate capacity",
      )
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    next(error);
  }
};

const cancelRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId is required to cancel registration" });
    }

    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (registration.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only cancel your own registration" });
    }

    if (registration.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Registration is already cancelled" });
    }

    registration.status = "cancelled";
    registration.cancelledAt = new Date();
    await registration.save();

    res
      .status(200)
      .json({ message: "Registration cancelled successfully", registration });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRegistration,
  getUserRegistrations,
  cancelRegistration,
};
