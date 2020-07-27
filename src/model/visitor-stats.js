const mongoose = require('mongoose');

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
