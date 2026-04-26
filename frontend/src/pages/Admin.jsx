import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Loading from '../components/Loading';

function StatsPanel({ stats }) {
  return (
    <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
      <div className="card stat-card">
        <div className="stat-value">{stats.users}</div>
        <div className="stat-label">Total Users</div>
      </div>
      <div className="card stat-card">
        <div className="stat-value">{stats.countries}</div>
        <div className="stat-label">Countries</div>
      </div>
      <div className="card stat-card">
        <div className="stat-value">{stats.universities}</div>
        <div className="stat-label">Universities</div>
      </div>
    </div>
  );
}

function CountriesPanel() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const res = await adminAPI.getCountries();
      setCountries(res.data.countries);
    } catch (err) {
      console.error('Failed to load countries:', err);
    }
    setLoading(false);
  };

  const handleEdit = (country) => {
    setEditing(country._id);
    setForm({
      name: country.name,
      code: country.code,
      description: country.description || '',
      minimumGPA: country.eligibilityCriteria?.academic?.minimumGPA || '',
      minimumIELTS: country.eligibilityCriteria?.language?.minimumIELTS || '',
      minimumTOEFL: country.eligibilityCriteria?.language?.minimumTOEFL || '',
      minimumBankBalance: country.eligibilityCriteria?.financial?.minimumBankBalance || '',
    });
  };

  const handleSave = async () => {
    try {
      await adminAPI.updateCountry(editing, {
        name: form.name,
        description: form.description,
        'eligibilityCriteria.academic.minimumGPA': Number(form.minimumGPA),
        'eligibilityCriteria.language.minimumIELTS': Number(form.minimumIELTS),
        'eligibilityCriteria.language.minimumTOEFL': Number(form.minimumTOEFL),
        'eligibilityCriteria.financial.minimumBankBalance': Number(form.minimumBankBalance),
      });
      setEditing(null);
      loadCountries();
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this country?')) return;
    try {
      await adminAPI.deleteCountry(id);
      loadCountries();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Manage Countries</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Code</th>
              <th>Min GPA</th>
              <th>Min IELTS</th>
              <th>Min Bank Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((c) => (
              <tr key={c._id}>
                {editing === c._id ? (
                  <>
                    <td><input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></td>
                    <td>{form.code}</td>
                    <td><input type="number" className="form-control" value={form.minimumGPA} onChange={(e) => setForm({ ...form, minimumGPA: e.target.value })} /></td>
                    <td><input type="number" className="form-control" value={form.minimumIELTS} onChange={(e) => setForm({ ...form, minimumIELTS: e.target.value })} /></td>
                    <td><input type="number" className="form-control" value={form.minimumBankBalance} onChange={(e) => setForm({ ...form, minimumBankBalance: e.target.value })} /></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={handleSave}>Save</button>{' '}
                      <button className="btn btn-outline btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><strong>{c.flagEmoji} {c.name}</strong></td>
                    <td>{c.code}</td>
                    <td>{c.eligibilityCriteria?.academic?.minimumGPA}</td>
                    <td>{c.eligibilityCriteria?.language?.minimumIELTS}</td>
                    <td>€{c.eligibilityCriteria?.financial?.minimumBankBalance?.toLocaleString()}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)}>Edit</button>{' '}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UniversitiesPanel() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '', country: 'Germany', city: '', description: '',
    tuitionMin: '', tuitionMax: '', website: '',
  });

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    try {
      const res = await adminAPI.getUniversities();
      setUniversities(res.data.universities);
    } catch (err) {
      console.error('Failed to load universities:', err);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    try {
      await adminAPI.createUniversity({
        name: addForm.name,
        country: addForm.country,
        city: addForm.city,
        description: addForm.description,
        website: addForm.website,
        tuitionRange: {
          min: Number(addForm.tuitionMin),
          max: Number(addForm.tuitionMax),
          currency: 'EUR',
        },
        languagesOfInstruction: ['English'],
        programs: [],
      });
      setShowAdd(false);
      setAddForm({ name: '', country: 'Germany', city: '', description: '', tuitionMin: '', tuitionMax: '', website: '' });
      loadUniversities();
    } catch (err) {
      console.error('Failed to add university:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this university?')) return;
    try {
      await adminAPI.deleteUniversity(id);
      loadUniversities();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Manage Universities</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add University</button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Add New University</h4>
          <div className="profile-grid">
            <div className="form-group">
              <label>Name</label>
              <input className="form-control" value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <select className="form-control" value={addForm.country}
                onChange={(e) => setAddForm({ ...addForm, country: e.target.value })}>
                {['Germany', 'France', 'Italy', 'Netherlands', 'Romania'].map((c) =>
                  <option key={c} value={c}>{c}</option>
                )}
              </select>
            </div>
            <div className="form-group">
              <label>City</label>
              <input className="form-control" value={addForm.city}
                onChange={(e) => setAddForm({ ...addForm, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input className="form-control" value={addForm.website}
                onChange={(e) => setAddForm({ ...addForm, website: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Min Tuition (EUR/yr)</label>
              <input type="number" className="form-control" value={addForm.tuitionMin}
                onChange={(e) => setAddForm({ ...addForm, tuitionMin: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Max Tuition (EUR/yr)</label>
              <input type="number" className="form-control" value={addForm.tuitionMax}
                onChange={(e) => setAddForm({ ...addForm, tuitionMax: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input className="form-control" value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={handleAdd}>Add University</button>
            <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>University</th>
              <th>Country</th>
              <th>City</th>
              <th>Tuition Range</th>
              <th>Programs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((u) => (
              <tr key={u._id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.country}</td>
                <td>{u.city}</td>
                <td>€{u.tuitionRange?.min?.toLocaleString()} - €{u.tuitionRange?.max?.toLocaleString()}</td>
                <td>{u.programs?.length || 0}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers().then((res) => {
      setUsers(res.data.users);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Users</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Nationality</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role === 'admin' ? 'badge-info' : 'badge-success'}`}>{u.role}</span></td>
                <td>{u.profile?.nationality || '-'}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Admin() {
  const [stats, setStats] = useState({ users: 0, countries: 0, universities: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.stats().then((res) => {
      setStats(res.data.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Admin Dashboard</h2>
      <StatsPanel stats={stats} />

      <div className="tabs">
        {['overview', 'countries', 'universities', 'users'].map((t) => (
          <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Welcome, Admin</h3>
          <p style={{ color: 'var(--gray-600)' }}>
            Use the tabs above to manage countries, universities, and users.
            Changes made here will be reflected immediately across the platform.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('countries')}>
              <h4>Manage Countries</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                Edit eligibility criteria, visa processes, and country details.
              </p>
            </div>
            <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('universities')}>
              <h4>Manage Universities</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                Add, edit, or remove universities and their programs.
              </p>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'countries' && <CountriesPanel />}
      {activeTab === 'universities' && <UniversitiesPanel />}
      {activeTab === 'users' && <UsersPanel />}
    </div>
  );
}
