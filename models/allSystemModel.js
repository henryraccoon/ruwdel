const mongoose = require('mongoose');

const allSystemSchema = new mongoose.Schema({
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

const AllSystem = mongoose.model('AllSystem', allSystemSchema);

module.exports = AllSystem;
