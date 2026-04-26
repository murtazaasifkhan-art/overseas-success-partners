# Overseas Success Partners

A full-stack web application that helps students evaluate their eligibility for studying in European countries and guides them through the entire study abroad process.

## Features

### Student Profile System
- Sign up and create detailed profiles with academic background, English proficiency, budget, and preferences
- JWT-based authentication for secure access

### Eligibility Engine
- Rule-based eligibility evaluation for 5 European countries: **Germany, France, Italy, Netherlands, Romania**
- Checks academic, language, financial, and visa requirements
- Outputs: Eligible / Partially Eligible / Not Eligible with detailed explanations

### Country Study Guidance
- Step-by-step visa process for each country
- Required documents checklists
- Application timelines
- Links to official immigration/study portals

### University Database
- 15+ universities across 5 countries with programs, tuition fees, and details
- Filter by country, budget, program level, and search
- Pagination support

### Smart Recommendations
- Score-based country ranking based on user profile
- University matching by budget and program level
- Personalized next steps

### Admin Dashboard
- Manage eligibility criteria
- Add/edit/delete countries and universities
- View registered users

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Styling | Custom CSS |

## Project Structure

```
overseas-success-partners/
├── backend/
│   ├── src/
│   │   ├── data/           # Seed data (countries, universities)
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Mongoose models (User, Country, University)
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Eligibility engine logic
│   │   ├── seed.js          # Database seeder
│   │   └── server.js        # Express server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth context provider
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── styles/          # CSS styles
│   │   ├── App.jsx          # Root component with routing
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd overseas-success-partners
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- 5 countries with eligibility criteria and study guides
- 15 universities with programs
- Admin account: `admin@osp.com` / `admin123`
- Sample student: `student@example.com` / `student123`

### 4. Start the Backend

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 5. Frontend Setup

```bash
cd ../frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
# App runs on http://localhost:5173
```

### 7. Open the App

Visit `http://localhost:5173` in your browser.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update profile |

### Countries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/countries` | List all countries |
| GET | `/api/countries/:code` | Get country details |
| GET | `/api/countries/:code/guide` | Get study guide |

### Universities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/universities` | List (with filters) |
| GET | `/api/universities/:id` | Get university details |

### Eligibility
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/eligibility/check` | Check eligibility (auth required) |
| POST | `/api/eligibility/check-guest` | Guest eligibility check |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recommendations` | Get recommendations (auth required) |

### Admin (admin role required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET/POST/PUT/DELETE | `/api/admin/countries` | CRUD countries |
| GET/POST/PUT/DELETE | `/api/admin/universities` | CRUD universities |
| GET | `/api/admin/users` | List users |

## Database Schema

### User
- email, password (hashed), name, role (student/admin)
- Profile: age, nationality, academic background, English proficiency, budget, preferences

### Country
- name, code, description, flag emoji
- Eligibility criteria: academic, language, financial, visa
- Study guide: visa process steps, documents, timeline, official links

### University
- name, country, city, website, ranking, description
- Programs: name, level, field, duration, language, tuition
- Tuition range, languages of instruction, scholarships

## Sample Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@osp.com | admin123 |
| Student | student@example.com | student123 |

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/overseas_success_partners
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## Design Decisions

- **Rule-based eligibility**: Structured criteria per country for deterministic, transparent results
- **No live scraping**: All data stored in database for reliability and speed
- **Scalable architecture**: Easy to add new countries, universities, and criteria
- **API-first design**: Backend ready for future mobile app or third-party integrations
- **JWT auth**: Stateless authentication for easy scaling

## Future Enhancements

- AI-based scoring system using ML models
- Chat assistant for personalized guidance
- Multi-language support (i18n)
- Document upload and tracking
- Application deadline notifications
- Integration with official university APIs
- Scholarship matching engine
