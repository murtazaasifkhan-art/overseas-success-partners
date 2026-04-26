const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  profile: {
    age: Number,
    nationality: String,
    academicBackground: {
      highestDegree: {
        type: String,
        enum: ['high_school', 'bachelors', 'masters', 'phd', ''],
        default: '',
      },
      gpa: Number,
      gpaScale: { type: Number, default: 4.0 },
      fieldOfStudy: String,
      institution: String,
      graduationYear: Number,
    },
    englishProficiency: {
      testType: {
        type: String,
        enum: ['ielts', 'toefl', 'duolingo', 'cambridge', 'none', ''],
        default: '',
      },
      score: Number,
    },
    budgetRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 50000 },
      currency: { type: String, default: 'EUR' },
    },
    preferredCountries: [String],
    preferredDegreeLevel: {
      type: String,
      enum: ['bachelors', 'masters', 'phd', ''],
      default: '',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
