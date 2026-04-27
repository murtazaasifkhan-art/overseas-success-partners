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
      .then((res) => { setResults(res.data.results); setLoading(false); })
      .catch((err) => { setError(err.response?.data?.error || 'Failed to check eligibility'); setLoading(false); });
  }, []);

  if (loading) return <Loading message="Evaluating your eligibility..." />;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 className="mb-1">Eligibility Check</h2>
      <p className="text-muted mb-3">
        Based on your profile, here is your eligibility status for each country.
        <Link to="/profile" style={{ marginLeft: '0.5rem' }}>Update your profile</Link> for more accurate results.
      </p>

      {error && (
        <div className="alert alert-error">
          {error}
          {error.includes('profile') && (
            <Link to="/profile" style={{ marginLeft: '0.5rem', fontWeight: 600 }}>Complete your profile &rarr;</Link>
          )}
        </div>
      )}

      {results.map((result) => {
        const statusClass = result.status === 'eligible' ? 'eligible' : result.status === 'partially_eligible' ? 'partial' : 'not-eligible';
        return (
          <div key={result.countryCode} className={`card eligibility-card ${statusClass}`} style={{ padding: '1.5rem' }}>
            <div className="eligibility-header">
              <h3>{result.country}</h3>
              <span className={`badge ${
                result.status === 'eligible' ? 'badge-success' :
                result.status === 'partially_eligible' ? 'badge-warning' : 'badge-danger'
              }`}>
                {result.status === 'eligible' ? 'Eligible' :
                 result.status === 'partially_eligible' ? 'Partially Eligible' : 'Not Eligible'}
              </span>
            </div>
            <p className="text-muted mb-2">{result.explanation}</p>

            <div className="eligibility-details">
              {Object.entries(result.details).map(([key, detail]) => (
                <div key={key} className="detail-card">
                  <h4>
                    <span style={{ color: detail.eligible ? 'var(--color-secondary)' : 'var(--color-danger)' }}>
                      {detail.eligible ? '✓' : '✗'}
                    </span>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </h4>
                  <ul>
                    {detail.reasons?.map((reason, i) => <li key={i}>{reason}</li>)}
                    {detail.reasons?.length === 0 && <li style={{ color: 'var(--color-secondary)' }}>Meets requirements</li>}
                  </ul>
                </div>
              ))}
            </div>

            <Link to={`/countries/${result.countryCode}`} className="btn btn-outline btn-sm mt-1">
              View Country Guide
            </Link>
          </div>
        );
      })}
    </div>
  );
}
