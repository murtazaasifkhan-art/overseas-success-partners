# Overseas Success Partners – Admin & Maintenance Guide

## Table of Contents

1. [Quick Start](#quick-start)
2. [Changing Themes](#changing-themes)
3. [Customizing the UI](#customizing-the-ui)
4. [Editing Content](#editing-content)
5. [Branding](#branding)
6. [Managing Data](#managing-data)
7. [Deployment](#deployment)
8. [Environment Variables](#environment-variables)

---

## Quick Start

### Admin Login
- URL: `https://your-app.com/login`
- Default credentials: `admin@osp.com` / `admin123`
- After login, the **Admin** link appears in the navbar

### Admin Dashboard
Navigate to **Admin** in the navbar. The dashboard has tabs:
- **Overview** – Stats and quick links
- **Themes** – Create/edit/switch themes
- **Branding** – App name, logo, homepage content
- **Countries** – Manage eligibility criteria
- **Universities** – Add/edit universities
- **Users** – View registered users

---

## Changing Themes

### Switch Between Existing Themes
1. Go to **Admin → Themes**
2. Click **Activate** on any theme card
3. The theme applies instantly site-wide

### Light/Dark Mode Toggle
Users can click the 🌙/☀️ button in the navbar to toggle between light and dark themes.

### Create a New Theme
1. Go to **Admin → Themes**
2. Click **+ Create Theme**
3. Set a name and choose light/dark mode
4. Customize all colors using the color pickers
5. Changes preview live as you edit
6. Click **Save Theme**

### Edit an Existing Theme
1. Click **Edit** on any theme card
2. Modify colors, typography, buttons, or cards
3. The **Live Preview** panel shows a miniature preview
4. Click **Save Theme** to apply changes
5. Click **Cancel** to discard and revert to active theme

### Theme Properties You Can Customize
| Category | Properties |
|----------|-----------|
| Colors | Primary, Secondary, Accent, Background, Surface, Text, Border, Hero gradient, Nav, Footer (23 color controls) |
| Typography | Google Font family, Base font size, Heading weight, Body weight, Line height |
| Buttons | Border radius (pill/rounded/square), Text transform, Font weight |
| Cards | Border radius, Border width |

---

## Customizing the UI

### Without Touching Code
All UI changes are made through the Admin panel:
- **Colors**: Admin → Themes → Edit → Colors section
- **Fonts**: Admin → Themes → Edit → Typography section (select from 14 Google Fonts)
- **Button styles**: Admin → Themes → Edit → Buttons section
- **Card styles**: Admin → Themes → Edit → Cards section

### How the Theming System Works
- All styles use **CSS variables** (e.g., `--color-primary`, `--font-body`)
- Themes are stored in MongoDB and loaded on app startup
- When a theme is activated, CSS variables are updated on `document.documentElement`
- Google Fonts are loaded dynamically via the Fonts API

---

## Editing Content

### Homepage
1. Go to **Admin → Branding**
2. Edit the **Hero Title** and **Hero Subtitle**
3. Add/edit/remove **Feature Cards** (icon, title, description)
4. Click **Save All Changes**

### Countries & Eligibility Rules
1. Go to **Admin → Countries**
2. Click **Edit** on any country row
3. Modify GPA requirements, IELTS scores, bank balance minimums
4. Click **Save**

### Universities
1. Go to **Admin → Universities**
2. Click **+ Add University** to create new entries
3. Fill in name, country, city, tuition range, website
4. Click **Delete** to remove universities

---

## Branding

### Change App Name
1. Go to **Admin → Branding**
2. Edit the **App Name** field
3. Click **Save All Changes**
4. The name updates in the navbar and footer

### Upload Logo
1. Go to **Admin → Branding**
2. Click the file input under **Logo**
3. Select an image (JPG, PNG, SVG, WebP – max 5MB)
4. The logo uploads and appears in the navbar

---

## Managing Data

### Countries
- Edit eligibility criteria (GPA, IELTS, bank balance)
- Changes affect the eligibility engine immediately

### Universities
- Add new universities with country, city, tuition range
- Delete universities no longer needed
- Programs are managed via the database directly

### Users
- View all registered users and their roles
- User data is read-only from the admin panel

---

## Deployment

### Frontend (Static Build)
```bash
cd frontend
npm run build
# Deploy the `dist/` folder to Vercel, Netlify, or any static host
```

**Vercel:**
```bash
npm install -g vercel
cd frontend
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
cd frontend/dist
netlify deploy --prod
```

### Backend (Node.js)
The backend needs Node.js 18+ and MongoDB.

**Render/Railway:**
1. Push to GitHub
2. Connect your repo
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables (see below)

**Manual/VPS:**
```bash
cd backend
npm install
npm start
```

### Redeployment Steps
1. Make your changes (or use admin panel for no-code changes)
2. For code changes: `cd frontend && npm run build`
3. Deploy the new `dist/` folder
4. Backend changes: restart the server

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGODB_URI=mongodb://localhost:27017/overseas_success_partners
JWT_SECRET=your-jwt-secret-change-in-production
PORT=5000
```

### Frontend (`frontend/.env.production`)
```
VITE_API_URL=https://your-backend-url/api
```

---

## Architecture Overview

```
overseas-success-partners/
├── backend/
│   ├── src/
│   │   ├── models/         # MongoDB schemas (User, Country, University, Theme, SiteConfig)
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/      # Auth middleware
│   │   ├── utils/          # Eligibility logic
│   │   ├── data/           # Seed data
│   │   ├── seed.js         # Database seeding
│   │   └── server.js       # Express app
│   └── uploads/            # Uploaded logos
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, Loading, ProtectedRoute
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── pages/          # All page components
│   │   ├── services/       # API client
│   │   └── styles/         # CSS with CSS variables
│   └── dist/               # Production build
└── ADMIN_GUIDE.md          # This file
```

### API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/siteconfig` | Get active site config + theme |
| PUT | `/api/siteconfig` | Update branding/homepage (admin) |
| GET | `/api/siteconfig/themes` | List all themes |
| POST | `/api/siteconfig/themes` | Create theme (admin) |
| PUT | `/api/siteconfig/themes/:id` | Update theme (admin) |
| DELETE | `/api/siteconfig/themes/:id` | Delete theme (admin) |
| POST | `/api/siteconfig/themes/:id/activate` | Activate theme (admin) |
| POST | `/api/upload/logo` | Upload logo image (admin) |
