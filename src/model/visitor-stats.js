const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },

  count: {
    type: Number
  },

  increaseSinceYesterday: {
    type: Number
  },

  weekMedian: {
    type: number
  }
});

module.exports = mongoose.model('VisitorStats', Schema);
