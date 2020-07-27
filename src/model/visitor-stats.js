const mongoose = require('mongoose');

/**
 * The schema reflects document model of data entity
 * for persistence of Google Analytics daily visitor statistics
 */
const Schema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },

  todayCount: {
    type: Number
  },

  increaseSinceYesterday: {
    type: Number
  },

  weekMedian: {
    type: Number
  }
});

module.exports = mongoose.model('VisitorStats', Schema);
