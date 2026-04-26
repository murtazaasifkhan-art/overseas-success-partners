const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: String,
  website: String,
  ranking: Number,
  description: String,
  programs: [{
    name: String,
    level: {
      type: String,
      enum: ['bachelors', 'masters', 'phd'],
    },
    field: String,
    duration: String,
    language: { type: String, default: 'English' },
    tuitionFeePerYear: Number,
    currency: { type: String, default: 'EUR' },
    requirements: String,
  }],
  tuitionRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'EUR' },
  },
  languagesOfInstruction: [String],
  facilities: [String],
  scholarshipsAvailable: { type: Boolean, default: false },
  applicationDeadline: String,
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

universitySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

universitySchema.index({ country: 1 });
universitySchema.index({ 'programs.level': 1 });
universitySchema.index({ 'programs.field': 1 });
universitySchema.index({ 'tuitionRange.max': 1 });

module.exports = mongoose.model('University', universitySchema);
