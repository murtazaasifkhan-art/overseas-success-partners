import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eligibilityAPI } from '../services/api';
import Loading from '../components/Loading';

export default function Eligibility() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    eligibilityAPI.checkAll()
      .then((res) => {
        setResults(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to check eligibility');
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading message="Evaluating your eligibility..." />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Eligibility Check</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
        Based on your profile, here is your eligibility status for each country.
        <Link to="/profile" style={{ marginLeft: '0.5rem' }}>Update your profile</Link> for more accurate results.
      </p>

      {error && (
        <div className="alert alert-error">
          {error}
          {error.includes('profile') && (
            <Link to="/profile" style={{ marginLeft: '0.5rem', fontWeight: 600 }}>
              Complete your profile &rarr;
            </Link>
          )}
        </div>
      )}

      {results.map((result) => (
        <div key={result.countryCode} className={`eligibility-result ${result.status}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3>{result.country}</h3>
            <span className={`badge ${
              result.status === 'eligible' ? 'badge-success' :
              result.status === 'partially_eligible' ? 'badge-warning' : 'badge-danger'
            }`}>
              {result.status === 'eligible' ? 'Eligible' :
               result.status === 'partially_eligible' ? 'Partially Eligible' : 'Not Eligible'}
            </span>
          </div>
          <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>{result.explanation}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {Object.entries(result.details).map(([key, detail]) => (
              <div key={key} className="eligibility-detail">
                <h4>
                  {detail.eligible ? '✓' : '✗'}{' '}
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </h4>
                <ul>
                  {detail.reasons?.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                  {detail.reasons?.length === 0 && (
                    <li style={{ color: 'var(--secondary)' }}>Meets requirements</li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <Link to={`/countries/${result.countryCode}`} className="btn btn-outline btn-sm">
              View Country Guide
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
