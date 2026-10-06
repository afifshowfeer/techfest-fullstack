const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// ─── POST /api/registrations ──────────────────────────────────────────────────
// Registers the logged-in user for an event. Decrements seatsAvailable.
router.post('/', protect, async (req, res, next) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, message: 'eventId is required.' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    if (event.seatsAvailable <= 0) {
      return res.status(400).json({ success: false, message: 'No seats available for this event.' });
    }

    // Check for duplicate registration
    const existing = await Registration.findOne({ user: req.user.id, event: eventId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already registered for this event.' });
    }

    const registration = await Registration.create({ user: req.user.id, event: eventId });

    // Decrement available seats
    event.seatsAvailable -= 1;
    await event.save();

    await registration.populate('event', 'name date venue category fee');

    res.status(201).json({ success: true, message: 'Registration successful.', data: registration });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/registrations/my ────────────────────────────────────────────────
// Returns all registrations of the currently logged-in user.
router.get('/my', protect, async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'name date venue category fee seatsAvailable')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: registrations.length, data: registrations });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/registrations ───────────────────────────────────────────────────
// Returns all registrations. Admin only.
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const registrations = await Registration.find()
      .populate('user', 'name email')
      .populate('event', 'name date category')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: registrations.length, data: registrations });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/registrations/:id ───────────────────────────────────────────
// Cancels a registration. The user can cancel their own; admin can cancel any.
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found.' });

    // Only the owner or an admin may cancel
    if (registration.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorised to cancel this registration.' });
    }

    // Re-increment available seats
    await Event.findByIdAndUpdate(registration.event, { $inc: { seatsAvailable: 1 } });

    await Registration.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Registration cancelled.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

