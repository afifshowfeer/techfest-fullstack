const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Other'],
    },
    description: {
      type: String,
      default: '',
    },
    fee: {
      type: Number,
      required: [true, 'Fee is required'],
      min: [0, 'Fee cannot be negative'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats are required'],
      min: [1, 'Must have at least 1 seat'],
    },
    seatsAvailable: {
      type: Number,
      default: function () {
        return this.totalSeats;
      },
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    venue: {
      type: String,
      default: 'TBD',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
