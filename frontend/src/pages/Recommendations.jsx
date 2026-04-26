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
      .then((res) => { setRecommendations(res.data.recommendations); setLoading(false); })
      .catch((err) => { setError(err.response?.data?.error || 'Failed to get recommendations'); setLoading(false); });
  }, []);

  if (loading) return <Loading message="Generating your personalized recommendations..." />;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 className="mb-1">Smart Recommendations</h2>
      <p className="text-muted mb-3">
        Personalized country and university recommendations based on your profile.
        <Link to="/profile" style={{ marginLeft: '0.5rem' }}>Update profile</Link> for better results.
      </p>

      {error && (
        <div className="alert alert-error">
          {error}
          {error.includes('profile') && (
            <Link to="/profile" style={{ marginLeft: '0.5rem', fontWeight: 600 }}>Complete your profile &rarr;</Link>
          )}
        </div>
      )}

      {recommendations.map((rec, idx) => (
        <div key={rec.countryCode} className="card rec-card" style={{ padding: '1.5rem' }}>
          <div className="rec-header">
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="rec-rank">#{idx + 1}</span>
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
              {rec.score}<span>/100</span>
            </div>
          </div>

          <div className="score-bar">
            <div className="score-bar-fill" style={{ width: `${rec.score}%` }} />
          </div>

          <div className="rec-stats">
            <div>
              <div className="rec-stat-value">{rec.matchingUniversities}</div>
              <div className="rec-stat-label">Matching Universities</div>
            </div>
            <div>
              <div className="rec-stat-value">{rec.totalUniversities}</div>
              <div className="rec-stat-label">Total Universities</div>
            </div>
            <div>
              <div className="rec-stat-value">{rec.score}%</div>
              <div className="rec-stat-label">Match Score</div>
            </div>
          </div>

          {rec.recommendedUniversities?.length > 0 && (
            <div className="mb-2">
              <h4 className="text-sm mb-1">Recommended Universities</h4>
              <div className="rec-universities">
                {rec.recommendedUniversities.map((uni, i) => (
                  <div key={i} className="rec-uni-card">
                    <h4>{uni.name}</h4>
                    <p>{uni.city} &bull; {uni.programCount} programs &bull; &euro;{uni.tuitionRange?.min?.toLocaleString()}-&euro;{uni.tuitionRange?.max?.toLocaleString()}/yr</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rec.nextSteps?.length > 0 && (
            <div className="mb-2">
              <h4 className="text-sm mb-1">Next Steps</h4>
              <ul className="rec-next-steps">
                {rec.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to={`/countries/${rec.countryCode}`} className="btn btn-outline btn-sm">Country Guide</Link>
            <Link to="/universities" className="btn btn-outline btn-sm">Browse Universities</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
