const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Country = require('./models/Country');
const University = require('./models/University');
const User = require('./models/User');
const countriesData = require('./data/countries');
const universitiesData = require('./data/universities');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/overseas_success_partners';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Country.deleteMany({}),
      University.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Seed countries
    await Country.insertMany(countriesData);
    console.log(`Seeded ${countriesData.length} countries`);

    // Seed universities
    await University.insertMany(universitiesData);
    console.log(`Seeded ${universitiesData.length} universities`);

    // Create admin user if not exists
    const adminEmail = 'admin@osp.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const admin = new User({
        email: adminEmail,
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
      });
      await admin.save();
      console.log('Created admin user (admin@osp.com / admin123)');
    } else {
      console.log('Admin user already exists');
    }

    // Create a sample student user
    const studentEmail = 'student@example.com';
    const existingStudent = await User.findOne({ email: studentEmail });
    if (!existingStudent) {
      const student = new User({
        email: studentEmail,
        password: 'student123',
        name: 'Sample Student',
        role: 'student',
        profile: {
          age: 22,
          nationality: 'Indian',
          academicBackground: {
            highestDegree: 'bachelors',
            gpa: 3.5,
            gpaScale: 4.0,
            fieldOfStudy: 'Computer Science',
            institution: 'Delhi University',
            graduationYear: 2024,
          },
          englishProficiency: {
            testType: 'ielts',
            score: 7.0,
          },
          budgetRange: {
            min: 5000,
            max: 15000,
            currency: 'EUR',
          },
          preferredCountries: ['Germany', 'Netherlands'],
          preferredDegreeLevel: 'masters',
        },
      });
      await student.save();
      console.log('Created sample student (student@example.com / student123)');
    }

    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
