const express = require('express');
const Event = require('../models/Event');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// ─── GET /api/events ──────────────────────────────────────────────────────────
// Returns all events. Supports optional ?category= filter.
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const events = await Event.find(filter).populate('createdBy', 'name email').sort({ date: 1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/events/:id ──────────────────────────────────────────────────────
// Returns a single event by ID.
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/events ─────────────────────────────────────────────────────────
// Creates a new event. Admin only.
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, category, description, fee, totalSeats, date, venue } = req.body;

    const event = await Event.create({
      name,
      category,
      description,
      fee,
      totalSeats,
      seatsAvailable: totalSeats,
      date,
      venue,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, message: 'Event created.', data: event });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/events/:id ──────────────────────────────────────────────────────
// Updates an existing event. Admin only.
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const Registration = require('../models/Registration');
    const updateData = { ...req.body };

    if (updateData.totalSeats !== undefined) {
      const booked = await Registration.countDocuments({
        event: req.params.id,
        status: 'confirmed',
      });
      updateData.seatsAvailable = Math.max(0, Number(updateData.totalSeats) - booked);
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    res.status(200).json({ success: true, message: 'Event updated.', data: event });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/events/:id ───────────────────────────────────────────────────
// Deletes an event. Admin only.
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    res.status(200).json({ success: true, message: 'Event deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

