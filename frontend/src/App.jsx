import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Countries from './pages/Countries';
import CountryDetail from './pages/CountryDetail';
import Universities from './pages/Universities';
import Eligibility from './pages/Eligibility';
import Recommendations from './pages/Recommendations';
import Admin from './pages/Admin';
import './styles/app.css';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/countries" element={<Countries />} />
                <Route path="/countries/:code" element={<CountryDetail />} />
                <Route path="/universities" element={<Universities />} />
                <Route path="/profile" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/eligibility" element={
                  <ProtectedRoute><Eligibility /></ProtectedRoute>
                } />
                <Route path="/recommendations" element={
                  <ProtectedRoute><Recommendations /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
