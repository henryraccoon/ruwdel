const mongoose = require('mongoose');

const systemsToClassesSchema = new mongoose.Schema({
  class: {
    type: String,
  },
  systems: [String],
});

const SystemsToClasses = mongoose.model(
  'SystemsToClasses',
  systemsToClassesSchema
);

module.exports = SystemsToClasses;
