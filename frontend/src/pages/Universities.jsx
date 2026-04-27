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
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [filters]);

  useEffect(() => { loadUniversities(); }, [loadUniversities]);

  const handleFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="animate-fade-in">
      <h2 className="mb-1">University Database</h2>
      <p className="text-muted mb-2">Explore universities across Europe. Filter by country, budget, or program level.</p>

      <div className="filter-bar">
        <select className="form-control" value={filters.country} onChange={(e) => handleFilter('country', e.target.value)}>
          <option value="">All Countries</option>
          {COUNTRIES.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-control" value={filters.level} onChange={(e) => handleFilter('level', e.target.value)}>
          <option value="">All Levels</option>
          {LEVELS.filter(Boolean).map((l) => (
            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
          ))}
        </select>
        <select className="form-control" value={filters.budget} onChange={(e) => handleFilter('budget', e.target.value)}>
          <option value="">Any Budget</option>
          <option value="1000">Under &euro;1,000/yr</option>
          <option value="5000">Under &euro;5,000/yr</option>
          <option value="10000">Under &euro;10,000/yr</option>
          <option value="20000">Under &euro;20,000/yr</option>
        </select>
        <input type="text" className="form-control" placeholder="Search universities..."
          value={filters.search} onChange={(e) => handleFilter('search', e.target.value)} />
      </div>

      {loading ? <Loading /> : universities.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p className="text-muted">No universities found matching your criteria.</p>
        </div>
      ) : (
        <>
          <p className="text-muted text-sm mb-2">
            Showing {universities.length} of {pagination.total} universities
          </p>
          <div className="grid grid-2 stagger">
            {universities.map((uni) => (
              <div key={uni._id} className="card card-hover uni-card">
                <div className="uni-card-header">
                  <div>
                    <h3>{uni.name}</h3>
                    <div className="uni-card-meta">
                      {uni.city}, {uni.country}
                      {uni.ranking && ` • Rank #${uni.ranking}`}
                    </div>
                  </div>
                  {uni.scholarshipsAvailable && <span className="badge badge-success">Scholarships</span>}
                </div>
                <div className="uni-card-details">
                  <p>{uni.description}</p>
                  <div className="mt-1">
                    <strong>Tuition:</strong> &euro;{uni.tuitionRange?.min?.toLocaleString()} - &euro;{uni.tuitionRange?.max?.toLocaleString()}/yr
                    {' | '}<strong>Languages:</strong> {uni.languagesOfInstruction?.join(', ')}
                  </div>
                  {uni.applicationDeadline && (
                    <div className="mt-1"><strong>Deadline:</strong> {uni.applicationDeadline}</div>
                  )}
                </div>
                <div className="uni-programs">
                  {uni.programs?.slice(0, expanded === uni._id ? undefined : 3).map((p, i) => (
                    <span key={i} className="program-tag">{p.name} ({p.level})</span>
                  ))}
                  {uni.programs?.length > 3 && expanded !== uni._id && (
                    <button className="program-tag" style={{ cursor: 'pointer', border: 'none' }}
                      onClick={() => setExpanded(uni._id)}>+{uni.programs.length - 3} more</button>
                  )}
                </div>
                {expanded === uni._id && (
                  <div style={{ borderTop: `1px solid var(--color-border-light)`, paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <h4 className="text-sm mb-1">All Programs</h4>
                    {uni.programs?.map((p, i) => (
                      <div key={i} style={{ padding: '0.5rem 0', borderBottom: `1px solid var(--color-border-light)`, fontSize: '0.85rem' }}>
                        <strong>{p.name}</strong>
                        <div className="text-muted">{p.level} | {p.duration} | {p.language} | &euro;{p.tuitionFeePerYear?.toLocaleString()}/yr</div>
                        {p.requirements && <div className="text-muted text-sm">Req: {p.requirements}</div>}
                      </div>
                    ))}
                    <button className="btn btn-outline btn-sm mt-1" onClick={() => setExpanded(null)}>Show less</button>
                  </div>
                )}
                {uni.website && (
                  <a href={uni.website} target="_blank" rel="noopener noreferrer" className="text-sm mt-1" style={{ display: 'inline-block' }}>
                    Visit Website &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} className={`btn btn-sm ${pagination.page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => loadUniversities(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
