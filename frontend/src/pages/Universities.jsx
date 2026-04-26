import { useState, useEffect, useCallback } from 'react';
import { universityAPI } from '../services/api';
import Loading from '../components/Loading';

const COUNTRIES = ['', 'Germany', 'France', 'Italy', 'Netherlands', 'Romania'];
const LEVELS = ['', 'bachelors', 'masters', 'phd'];

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ country: '', budget: '', level: '', search: '' });
  const [expanded, setExpanded] = useState(null);

  const loadUniversities = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filters.country) params.country = filters.country;
      if (filters.budget) params.budget = filters.budget;
      if (filters.level) params.level = filters.level;
      if (filters.search) params.search = filters.search;

      const res = await universityAPI.list(params);
      setUniversities(res.data.universities);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load universities:', err);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

  const handleFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem' }}>University Database</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
        Explore universities across Europe. Filter by country, budget, or program level.
      </p>

      <div className="filter-bar">
        <select className="form-control" value={filters.country}
          onChange={(e) => handleFilter('country', e.target.value)}>
          <option value="">All Countries</option>
          {COUNTRIES.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-control" value={filters.level}
          onChange={(e) => handleFilter('level', e.target.value)}>
          <option value="">All Levels</option>
          {LEVELS.filter(Boolean).map((l) => (
            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
          ))}
        </select>
        <select className="form-control" value={filters.budget}
          onChange={(e) => handleFilter('budget', e.target.value)}>
          <option value="">Any Budget</option>
          <option value="1000">Under €1,000/yr</option>
          <option value="5000">Under €5,000/yr</option>
          <option value="10000">Under €10,000/yr</option>
          <option value="20000">Under €20,000/yr</option>
        </select>
        <input type="text" className="form-control" placeholder="Search universities..."
          value={filters.search} onChange={(e) => handleFilter('search', e.target.value)} />
      </div>

      {loading ? (
        <Loading />
      ) : universities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--gray-400)' }}>No universities found matching your criteria.</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Showing {universities.length} of {pagination.total} universities
          </p>
          <div className="grid grid-2">
            {universities.map((uni) => (
              <div key={uni._id} className="card uni-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3>{uni.name}</h3>
                    <div className="uni-meta">
                      {uni.city}, {uni.country}
                      {uni.ranking && ` • Rank #${uni.ranking}`}
                    </div>
                  </div>
                  {uni.scholarshipsAvailable && (
                    <span className="badge badge-success">Scholarships</span>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                  {uni.description}
                </p>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                  <strong>Tuition:</strong> €{uni.tuitionRange?.min?.toLocaleString()} - €{uni.tuitionRange?.max?.toLocaleString()}/yr
                  {' | '}
                  <strong>Languages:</strong> {uni.languagesOfInstruction?.join(', ')}
                </div>
                {uni.applicationDeadline && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                    <strong>Deadline:</strong> {uni.applicationDeadline}
                  </div>
                )}

                <div className="uni-programs">
                  {uni.programs?.slice(0, expanded === uni._id ? undefined : 3).map((p, i) => (
                    <span key={i} className="uni-tag">
                      {p.name} ({p.level})
                    </span>
                  ))}
                  {uni.programs?.length > 3 && expanded !== uni._id && (
                    <button className="uni-tag" style={{ cursor: 'pointer', border: 'none' }}
                      onClick={() => setExpanded(uni._id)}>
                      +{uni.programs.length - 3} more
                    </button>
                  )}
                </div>

                {expanded === uni._id && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid var(--gray-200)', paddingTop: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>All Programs</h4>
                    {uni.programs?.map((p, i) => (
                      <div key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)', fontSize: '0.85rem' }}>
                        <strong>{p.name}</strong>
                        <div style={{ color: 'var(--gray-500)' }}>
                          {p.level} | {p.duration} | {p.language} | €{p.tuitionFeePerYear?.toLocaleString()}/yr
                        </div>
                        {p.requirements && <div style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>Req: {p.requirements}</div>}
                      </div>
                    ))}
                    <button className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }}
                      onClick={() => setExpanded(null)}>Show less</button>
                  </div>
                )}

                {uni.website && (
                  <a href={uni.website} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                    Visit Website &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} className={`btn btn-sm ${pagination.page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => loadUniversities(i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
