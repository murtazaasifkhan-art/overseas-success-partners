import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <div className="hero">
        <h1>Your Journey to Study in Europe Starts Here</h1>
        <p>
          Evaluate your eligibility, explore top universities, and get personalized 
          guidance for studying in Germany, France, Italy, Netherlands, and Romania.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {user ? (
            <>
              <Link to="/eligibility" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)' }}>
                Check Eligibility
              </Link>
              <Link to="/recommendations" className="btn btn-lg btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                Get Recommendations
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)' }}>
                Get Started Free
              </Link>
              <Link to="/countries" className="btn btn-lg btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                Explore Countries
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎯</div>
          <h3>Eligibility Check</h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            Instantly evaluate your eligibility for studying in 5 European countries 
            based on your academic background, language skills, and finances.
          </p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏫</div>
          <h3>University Database</h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            Browse universities across Europe. Filter by country, budget, and 
            program to find the perfect fit for your goals.
          </p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🗺️</div>
          <h3>Step-by-Step Guides</h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            Get detailed visa processes, document checklists, and application 
            timelines for each country.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Supported Countries</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { flag: '🇩🇪', name: 'Germany', code: 'DE' },
            { flag: '🇫🇷', name: 'France', code: 'FR' },
            { flag: '🇮🇹', name: 'Italy', code: 'IT' },
            { flag: '🇳🇱', name: 'Netherlands', code: 'NL' },
            { flag: '🇷🇴', name: 'Romania', code: 'RO' },
          ].map((c) => (
            <Link
              to={`/countries/${c.code}`}
              key={c.code}
              className="card"
              style={{ textAlign: 'center', padding: '1.5rem 2rem', minWidth: '140px' }}
            >
              <div style={{ fontSize: '3rem' }}>{c.flag}</div>
              <div style={{ fontWeight: 600, marginTop: '0.5rem' }}>{c.name}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Ready to Start Your Journey?</h2>
        <p style={{ color: 'var(--gray-500)', margin: '1rem 0 1.5rem', maxWidth: '500px', marginInline: 'auto' }}>
          Create your profile, check your eligibility, and get personalized 
          university recommendations in minutes.
        </p>
        {!user && (
          <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
        )}
      </div>
    </div>
  );
}
