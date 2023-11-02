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
  Date: {
    type: String,
  },
});

const System = mongoose.model('System', systemSchema);

module.exports = System;
