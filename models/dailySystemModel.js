const mongoose = require('mongoose');

// sub-schema
const systemSchema = new mongoose.Schema({
  country: {
    type: String,
  },
  origin: {
    type: String,
  },
  system: {
    type: String,
  },
  status: {
    type: String,
  },
  url: {
    type: String,
  },
});

// main schema
const dailySystemSchema = new mongoose.Schema({
  date: {
    type: String,
  },
  systems: [systemSchema],
});

const System = mongoose.model('System', systemSchema);
const DailySystem = mongoose.model('DailySystem', dailySystemSchema);

module.exports = { System, DailySystem };
