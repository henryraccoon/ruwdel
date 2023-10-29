const mongoose = require('mongoose');

const TotalSystemSchema = new mongoose.Schema({
  country: {
    type: String,
  },
  equipment_type: {
    type: String,
  },
  destroyed: {
    type: Number,
  },
  abandoned: {
    type: Number,
  },
  captured: {
    type: Number,
  },
  damaged: {
    type: Number,
  },
  type_total: {
    type: Number,
  },
});

const TotalSystem = mongoose.model('TotalSystem', TotalSystemSchema);

module.exports = TotalSystem;
