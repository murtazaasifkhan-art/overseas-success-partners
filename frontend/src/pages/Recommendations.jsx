import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationAPI } from '../services/api';
import Loading from '../components/Loading';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    recommendationAPI.get()
      .then((res) => {
        setRecommendations(res.data.recommendations);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to get recommendations');
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading message="Generating your personalized recommendations..." />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Smart Recommendations</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
        Personalized country and university recommendations based on your profile.
        <Link to="/profile" style={{ marginLeft: '0.5rem' }}>Update profile</Link> for better results.
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

      {recommendations.map((rec, idx) => (
        <div key={rec.countryCode} className="card rec-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>#{idx + 1}</span>
                {rec.country}
              </h3>
              <span className={`badge ${
                rec.eligibility?.status === 'eligible' ? 'badge-success' :
                rec.eligibility?.status === 'partially_eligible' ? 'badge-warning' : 'badge-danger'
              }`} style={{ marginTop: '0.25rem' }}>
                {rec.eligibility?.status === 'eligible' ? 'Eligible' :
                 rec.eligibility?.status === 'partially_eligible' ? 'Partially Eligible' : 'Not Eligible'}
              </span>
            </div>
            <div className="rec-score">
              <span>{rec.score}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 400 }}>/100</span>
            </div>
          </div>

          <div className="rec-bar">
            <div className="rec-bar-fill" style={{ width: `${rec.score}%` }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', margin: '1rem 0', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{rec.matchingUniversities}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Matching Universities</div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{rec.totalUniversities}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Total Universities</div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{rec.score}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Match Score</div>
            </div>
          </div>

          {rec.recommendedUniversities?.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Recommended Universities</h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {rec.recommendedUniversities.map((uni, i) => (
                  <div key={i} style={{
                    padding: '0.5rem 1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)',
                    border: '1px solid var(--gray-200)', fontSize: '0.85rem',
                  }}>
                    <strong>{uni.name}</strong>
                    <div style={{ color: 'var(--gray-500)' }}>
                      {uni.city} • {uni.programCount} programs • €{uni.tuitionRange?.min?.toLocaleString()}-€{uni.tuitionRange?.max?.toLocaleString()}/yr
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rec.nextSteps?.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Next Steps</h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                {rec.nextSteps.map((step, i) => <li key={i} style={{ padding: '0.2rem 0' }}>{step}</li>)}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            <Link to={`/countries/${rec.countryCode}`} className="btn btn-outline btn-sm">
              Country Guide
            </Link>
            <Link to="/universities" className="btn btn-outline btn-sm">
              Browse Universities
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
