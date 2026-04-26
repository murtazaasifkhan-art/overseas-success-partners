const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  flagEmoji: String,
  description: String,
  eligibilityCriteria: {
    academic: {
      minimumDegree: {
        type: String,
        enum: ['high_school', 'bachelors', 'masters'],
      },
      minimumGPA: Number,
      gpaScale: { type: Number, default: 4.0 },
      acceptedFields: [String],
      notes: String,
    },
    language: {
      englishRequired: { type: Boolean, default: true },
      minimumIELTS: Number,
      minimumTOEFL: Number,
      localLanguageRequired: Boolean,
      localLanguage: String,
      localLanguageLevel: String,
      notes: String,
    },
    financial: {
      proofRequired: { type: Boolean, default: true },
      minimumBankBalance: Number,
      currency: { type: String, default: 'EUR' },
      scholarshipsAvailable: { type: Boolean, default: false },
      averageTuitionMin: Number,
      averageTuitionMax: Number,
      averageLivingCostPerYear: Number,
      notes: String,
    },
    visa: {
      studentVisaRequired: { type: Boolean, default: true },
      processingTimeWeeks: { min: Number, max: Number },
      workPermitWithStudy: Boolean,
      maxWorkHoursPerWeek: Number,
      healthInsuranceRequired: { type: Boolean, default: true },
      notes: String,
    },
  },
  studyGuide: {
    visaProcess: [{ step: Number, title: String, description: String }],
    requiredDocuments: [String],
    applicationTimeline: [{ month: String, activity: String }],
    officialLinks: [{ title: String, url: String }],
  },
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

countrySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Country', countrySchema);
