const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Country = require('./models/Country');
const University = require('./models/University');
const User = require('./models/User');
const Theme = require('./models/Theme');
const SiteConfig = require('./models/SiteConfig');
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

    // Seed default themes
    await Theme.deleteMany({});
    await SiteConfig.deleteMany({});

    const lightTheme = await Theme.create({
      name: 'Default Light',
      mode: 'light',
      isDefault: true,
      colors: {
        primary: '#2563eb', primaryDark: '#1d4ed8', primaryLight: '#dbeafe',
        secondary: '#059669', secondaryLight: '#d1fae5',
        accent: '#7c3aed', accentLight: '#ede9fe',
        danger: '#dc2626', dangerLight: '#fee2e2',
        warning: '#d97706', warningLight: '#fef3c7',
        background: '#f8fafc', surface: '#ffffff',
        surfaceHover: '#f1f5f9',
        textPrimary: '#0f172a', textSecondary: '#475569', textMuted: '#94a3b8',
        border: '#e2e8f0', borderLight: '#f1f5f9',
        heroGradientStart: '#2563eb', heroGradientEnd: '#7c3aed',
        navBackground: '#ffffff', navText: '#475569',
        footerBackground: '#ffffff', footerText: '#94a3b8',
      },
    });

    await Theme.create({
      name: 'Dark Mode',
      mode: 'dark',
      colors: {
        primary: '#3b82f6', primaryDark: '#2563eb', primaryLight: '#1e3a5f',
        secondary: '#10b981', secondaryLight: '#064e3b',
        accent: '#8b5cf6', accentLight: '#2e1065',
        danger: '#ef4444', dangerLight: '#450a0a',
        warning: '#f59e0b', warningLight: '#451a03',
        background: '#0f172a', surface: '#1e293b',
        surfaceHover: '#334155',
        textPrimary: '#f1f5f9', textSecondary: '#cbd5e1', textMuted: '#64748b',
        border: '#334155', borderLight: '#1e293b',
        heroGradientStart: '#1e3a8a', heroGradientEnd: '#5b21b6',
        navBackground: '#1e293b', navText: '#cbd5e1',
        footerBackground: '#1e293b', footerText: '#64748b',
      },
    });

    await Theme.create({
      name: 'Ocean Breeze',
      mode: 'light',
      colors: {
        primary: '#0891b2', primaryDark: '#0e7490', primaryLight: '#cffafe',
        secondary: '#059669', secondaryLight: '#d1fae5',
        accent: '#6366f1', accentLight: '#e0e7ff',
        danger: '#dc2626', dangerLight: '#fee2e2',
        warning: '#d97706', warningLight: '#fef3c7',
        background: '#f0fdfa', surface: '#ffffff',
        surfaceHover: '#f0fdfa',
        textPrimary: '#134e4a', textSecondary: '#5f7a76', textMuted: '#94a3b8',
        border: '#ccfbf1', borderLight: '#f0fdfa',
        heroGradientStart: '#0891b2', heroGradientEnd: '#6366f1',
        navBackground: '#ffffff', navText: '#5f7a76',
        footerBackground: '#ffffff', footerText: '#94a3b8',
      },
      typography: { googleFont: 'Poppins', fontFamily: "'Poppins', sans-serif", fontFamilyHeading: "'Poppins', sans-serif" },
    });

    await Theme.create({
      name: 'Sunset Warm',
      mode: 'light',
      colors: {
        primary: '#ea580c', primaryDark: '#c2410c', primaryLight: '#ffedd5',
        secondary: '#0d9488', secondaryLight: '#ccfbf1',
        accent: '#db2777', accentLight: '#fce7f3',
        danger: '#dc2626', dangerLight: '#fee2e2',
        warning: '#d97706', warningLight: '#fef3c7',
        background: '#fffbeb', surface: '#ffffff',
        surfaceHover: '#fef3c7',
        textPrimary: '#431407', textSecondary: '#78716c', textMuted: '#a8a29e',
        border: '#fed7aa', borderLight: '#ffedd5',
        heroGradientStart: '#ea580c', heroGradientEnd: '#db2777',
        navBackground: '#ffffff', navText: '#78716c',
        footerBackground: '#ffffff', footerText: '#a8a29e',
      },
      typography: { googleFont: 'Roboto', fontFamily: "'Roboto', sans-serif", fontFamilyHeading: "'Roboto', sans-serif" },
    });

    await SiteConfig.create({
      key: 'main',
      activeThemeId: lightTheme._id,
      branding: { appName: 'Overseas Success Partners' },
      homepage: {
        heroTitle: 'Your Journey to Study in Europe Starts Here',
        heroSubtitle: 'Evaluate your eligibility, explore top universities, and get personalized guidance for studying in Germany, France, Italy, Netherlands, and Romania.',
        features: [
          { icon: '🎯', title: 'Eligibility Check', description: 'Instantly evaluate your eligibility for studying in 5 European countries based on your academic background, language skills, and finances.' },
          { icon: '🏛️', title: 'University Database', description: 'Browse universities across Europe. Filter by country, budget, and program to find the perfect fit for your goals.' },
          { icon: '🗺️', title: 'Step-by-Step Guides', description: 'Get detailed visa processes, document checklists, and application timelines for each country.' },
        ],
      },
    });
    console.log('Seeded 4 themes and site config');

    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
