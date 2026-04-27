import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const defaultFeatures = [
  { icon: '🎯', title: 'Eligibility Check', description: 'Instantly evaluate your eligibility for studying in 5 European countries based on your academic background, language skills, and finances.' },
  { icon: '🏛️', title: 'University Database', description: 'Browse universities across Europe. Filter by country, budget, and program to find the perfect fit for your goals.' },
  { icon: '🗺️', title: 'Step-by-Step Guides', description: 'Get detailed visa processes, document checklists, and application timelines for each country.' },
];

const countries = [
  { code: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', flag: '🇫🇷', name: 'France' },
  { code: 'IT', flag: '🇮🇹', name: 'Italy' },
  { code: 'NL', flag: '🇳🇱', name: 'Netherlands' },
  { code: 'RO', flag: '🇷🇴', name: 'Romania' },
];

export default function Home() {
  const { user } = useAuth();
  const { siteConfig } = useTheme();

  const heroTitle = siteConfig?.homepage?.heroTitle || 'Your Journey to Study in Europe Starts Here';
  const heroSubtitle = siteConfig?.homepage?.heroSubtitle || 'Evaluate your eligibility, explore top universities, and get personalized guidance for studying in Germany, France, Italy, Netherlands, and Romania.';
  const features = siteConfig?.homepage?.features?.length > 0 ? siteConfig.homepage.features : defaultFeatures;

  return (
    <div className="animate-fade-in">
      <div className="hero">
        <h1>{heroTitle}</h1>
        <p>{heroSubtitle}</p>
        <div className="hero-buttons">
          {user ? (
            <>
              <Link to="/eligibility" className="btn btn-hero-primary btn-lg">Check Eligibility</Link>
              <Link to="/recommendations" className="btn btn-hero-secondary btn-lg">View Recommendations</Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-hero-primary btn-lg">Get Started Free</Link>
              <Link to="/countries" className="btn btn-hero-secondary btn-lg">Explore Countries</Link>
            </>
          )}
        </div>
      </div>

      <div className="features-section">
        <h2>Everything You Need</h2>
        <p className="subtitle">Plan your study abroad journey with confidence</p>
        <div className="grid grid-3 stagger">
          {features.map((f, i) => (
            <div key={i} className="card card-hover feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="countries-section">
        <h2 className="text-center mb-2">Supported Countries</h2>
        <div className="country-grid stagger">
          {countries.map((c) => (
            <Link key={c.code} to={`/countries/${c.code}`} className="card card-hover country-flag-card">
              <span className="flag">{c.flag}</span>
              <span className="name">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {!user && (
        <div className="card text-center animate-slide-up" style={{ padding: '3rem 2rem', marginTop: '2rem' }}>
          <h2>Ready to Start Your Journey?</h2>
          <p className="text-muted mt-1 mb-2">Create your free profile and discover which European countries match your goals.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
        </div>
      )}
    </div>
  );
}
