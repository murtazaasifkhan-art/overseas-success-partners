import { useState, useEffect } from 'react';
import { adminAPI, siteConfigAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Loading from '../components/Loading';

/* =================== Stats =================== */
function StatsPanel({ stats }) {
  return (
    <div className="grid grid-3 stagger" style={{ marginBottom: '2rem' }}>
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

/* =================== Themes =================== */
function ThemesPanel() {
  const { theme: activeTheme, themes, switchTheme, loadThemes, previewTheme, applyActiveTheme } = useTheme();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const GOOGLE_FONTS = ['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Nunito', 'Raleway', 'Source Sans 3', 'Playfair Display', 'Merriweather', 'DM Sans', 'Space Grotesk', 'Outfit'];

  const startEdit = (t) => {
    setEditing(t._id);
    setForm(JSON.parse(JSON.stringify(t)));
  };

  const startCreate = () => {
    setEditing('new');
    setForm({
      name: 'New Theme',
      mode: 'light',
      colors: activeTheme?.colors ? { ...activeTheme.colors } : {},
      typography: activeTheme?.typography ? { ...activeTheme.typography } : {},
      buttons: activeTheme?.buttons ? { ...activeTheme.buttons } : {},
      cards: activeTheme?.cards ? { ...activeTheme.cards } : {},
      layout: activeTheme?.layout ? { ...activeTheme.layout } : {},
    });
  };

  const handleColorChange = (key, value) => {
    const updated = { ...form, colors: { ...form.colors, [key]: value } };
    setForm(updated);
    previewTheme(updated);
  };

  const handleTypographyChange = (key, value) => {
    const updated = { ...form, typography: { ...form.typography, [key]: value } };
    if (key === 'googleFont') {
      updated.typography.fontFamily = `'${value}', sans-serif`;
      updated.typography.fontFamilyHeading = `'${value}', sans-serif`;
    }
    setForm(updated);
    previewTheme(updated);
  };

  const handleButtonChange = (key, value) => {
    const updated = { ...form, buttons: { ...form.buttons, [key]: value } };
    setForm(updated);
    previewTheme(updated);
  };

  const handleCardChange = (key, value) => {
    const updated = { ...form, cards: { ...form.cards, [key]: value } };
    setForm(updated);
    previewTheme(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      if (editing === 'new') {
        await siteConfigAPI.createTheme(form);
        setMsg('Theme created!');
      } else {
        await siteConfigAPI.updateTheme(editing, form);
        setMsg('Theme updated!');
      }
      await loadThemes();
      setEditing(null);
      applyActiveTheme();
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.error || 'Failed to save'));
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this theme?')) return;
    try {
      await siteConfigAPI.deleteTheme(id);
      await loadThemes();
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.error || 'Cannot delete'));
    }
  };

  const handleActivate = async (id) => {
    await switchTheme(id);
    setMsg('Theme activated!');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleCancel = () => {
    setEditing(null);
    applyActiveTheme();
  };

  const colorFields = [
    ['primary', 'Primary'], ['primaryDark', 'Primary Dark'], ['primaryLight', 'Primary Light'],
    ['secondary', 'Secondary'], ['secondaryLight', 'Secondary Light'],
    ['accent', 'Accent'], ['accentLight', 'Accent Light'],
    ['danger', 'Danger'], ['warning', 'Warning'],
    ['background', 'Background'], ['surface', 'Surface'], ['surfaceHover', 'Surface Hover'],
    ['textPrimary', 'Text Primary'], ['textSecondary', 'Text Secondary'], ['textMuted', 'Text Muted'],
    ['border', 'Border'], ['borderLight', 'Border Light'],
    ['heroGradientStart', 'Hero Gradient Start'], ['heroGradientEnd', 'Hero Gradient End'],
    ['navBackground', 'Nav Background'], ['navText', 'Nav Text'],
    ['footerBackground', 'Footer Bg'], ['footerText', 'Footer Text'],
  ];

  return (
    <div>
      <div className="flex-between mb-2">
        <h3>Theme Management</h3>
        <button className="btn btn-primary btn-sm" onClick={startCreate}>+ Create Theme</button>
      </div>

      {msg && <div className={`alert ${msg.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

      {!editing && (
        <div className="grid grid-3 stagger">
          {themes.map((t) => (
            <div key={t._id} className={`card card-hover theme-card ${activeTheme?._id === t._id ? 'active-theme' : ''}`}>
              <div className="theme-card-name">{t.name}</div>
              <div className="theme-card-mode">{t.mode} mode {t.isDefault ? '(default)' : ''}</div>
              <div className="theme-card-colors">
                {[t.colors?.primary, t.colors?.secondary, t.colors?.accent, t.colors?.background, t.colors?.textPrimary].filter(Boolean).map((c, i) => (
                  <div key={i} className="theme-swatch" style={{ background: c }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {activeTheme?._id !== t._id && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleActivate(t._id)}>Activate</button>
                )}
                <button className="btn btn-outline btn-sm" onClick={() => startEdit(t)}>Edit</button>
                {!t.isDefault && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}>Delete</button>
                )}
              </div>
              {activeTheme?._id === t._id && <span className="badge badge-success" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>Active</span>}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="animate-fade-in">
          <div className="card mb-2">
            <div className="flex-between mb-2">
              <h4>{editing === 'new' ? 'Create New Theme' : `Editing: ${form.name}`}</h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Theme'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleCancel}>Cancel</button>
              </div>
            </div>

            <div className="profile-grid mb-2">
              <div className="form-group">
                <label>Theme Name</label>
                <input className="form-control" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Mode</label>
                <select className="form-control" value={form.mode || 'light'} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="card mb-2">
            <h4 className="mb-2">Colors</h4>
            <div className="grid grid-2">
              {colorFields.map(([key, label]) => (
                <div key={key} className="color-input-group">
                  <label>{label}</label>
                  <input type="color" value={form.colors?.[key] || '#000000'} onChange={(e) => handleColorChange(key, e.target.value)} />
                  <input type="text" className="form-control" value={form.colors?.[key] || ''} onChange={(e) => handleColorChange(key, e.target.value)} style={{ width: '100px' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="card mb-2">
            <h4 className="mb-2">Typography</h4>
            <div className="profile-grid">
              <div className="form-group">
                <label>Google Font</label>
                <select className="form-control" value={form.typography?.googleFont || 'Inter'} onChange={(e) => handleTypographyChange('googleFont', e.target.value)}>
                  {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Base Font Size</label>
                <select className="form-control" value={form.typography?.baseFontSize || '16px'} onChange={(e) => handleTypographyChange('baseFontSize', e.target.value)}>
                  {['14px', '15px', '16px', '17px', '18px'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Heading Weight</label>
                <select className="form-control" value={form.typography?.headingWeight || '700'} onChange={(e) => handleTypographyChange('headingWeight', e.target.value)}>
                  {['400', '500', '600', '700', '800'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Body Weight</label>
                <select className="form-control" value={form.typography?.bodyWeight || '400'} onChange={(e) => handleTypographyChange('bodyWeight', e.target.value)}>
                  {['300', '400', '500'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Line Height</label>
                <select className="form-control" value={form.typography?.lineHeight || '1.6'} onChange={(e) => handleTypographyChange('lineHeight', e.target.value)}>
                  {['1.4', '1.5', '1.6', '1.7', '1.8'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="card mb-2">
            <h4 className="mb-2">Buttons</h4>
            <div className="profile-grid">
              <div className="form-group">
                <label>Border Radius</label>
                <select className="form-control" value={form.buttons?.borderRadius || '8px'} onChange={(e) => handleButtonChange('borderRadius', e.target.value)}>
                  {['0px', '4px', '6px', '8px', '12px', '16px', '9999px'].map(r => <option key={r} value={r}>{r}{r === '9999px' ? ' (pill)' : ''}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Text Transform</label>
                <select className="form-control" value={form.buttons?.textTransform || 'none'} onChange={(e) => handleButtonChange('textTransform', e.target.value)}>
                  <option value="none">None</option>
                  <option value="uppercase">Uppercase</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </div>
              <div className="form-group">
                <label>Font Weight</label>
                <select className="form-control" value={form.buttons?.fontWeight || '600'} onChange={(e) => handleButtonChange('fontWeight', e.target.value)}>
                  {['400', '500', '600', '700'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-secondary">Secondary</button>
              <button className="btn btn-accent">Accent</button>
              <button className="btn btn-outline">Outline</button>
              <button className="btn btn-danger">Danger</button>
            </div>
          </div>

          {/* Cards */}
          <div className="card mb-2">
            <h4 className="mb-2">Cards</h4>
            <div className="profile-grid">
              <div className="form-group">
                <label>Card Border Radius</label>
                <select className="form-control" value={form.cards?.borderRadius || '12px'} onChange={(e) => handleCardChange('borderRadius', e.target.value)}>
                  {['0px', '4px', '8px', '12px', '16px', '24px'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Card Border Width</label>
                <select className="form-control" value={form.cards?.borderWidth || '1px'} onChange={(e) => handleCardChange('borderWidth', e.target.value)}>
                  {['0px', '1px', '2px'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="card mb-2">
            <h4 className="mb-2">Live Preview</h4>
            <div className="preview-panel">
              <div className="preview-nav" style={{ background: form.colors?.navBackground, color: form.colors?.navText, borderBottom: `1px solid ${form.colors?.border}` }}>
                <span style={{ fontWeight: 700, color: form.colors?.primary }}>🎓 App Preview</span>
                <span>Links &nbsp; Pages &nbsp; Login</span>
              </div>
              <div className="preview-hero" style={{ background: `linear-gradient(135deg, ${form.colors?.heroGradientStart}, ${form.colors?.heroGradientEnd})` }}>
                <h3>Welcome to Your App</h3>
                <p>This is how the hero section looks</p>
              </div>
              <div className="preview-cards" style={{ background: form.colors?.background }}>
                {['Feature A', 'Feature B', 'Feature C'].map(name => (
                  <div key={name} className="preview-card-mini" style={{
                    background: form.colors?.surface,
                    border: `1px solid ${form.colors?.border}`,
                    color: form.colors?.textPrimary,
                  }}>
                    <strong>{name}</strong><br />
                    <span style={{ color: form.colors?.textSecondary, fontSize: '0.65rem' }}>Description text</span>
                  </div>
                ))}
              </div>
              <div className="preview-footer" style={{ background: form.colors?.footerBackground, color: form.colors?.footerText, borderTop: `1px solid ${form.colors?.border}` }}>
                Footer area
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =================== Branding =================== */
function BrandingPanel() {
  const { siteConfig, updateConfig, loadConfig, getLogoUrl } = useTheme();
  const [appName, setAppName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [features, setFeatures] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (siteConfig) {
      setAppName(siteConfig.branding?.appName || '');
      setHeroTitle(siteConfig.homepage?.heroTitle || '');
      setHeroSubtitle(siteConfig.homepage?.heroSubtitle || '');
      setFeatures(siteConfig.homepage?.features || []);
    }
  }, [siteConfig]);

  const handleSave = async () => {
    try {
      await updateConfig({
        branding: { ...siteConfig.branding, appName },
        homepage: { heroTitle, heroSubtitle, features },
      });
      await loadConfig();
      setMsg('Saved successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Error saving: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const res = await siteConfigAPI.uploadLogo(formData);
      await updateConfig({ branding: { ...siteConfig.branding, logoUrl: res.data.url } });
      await loadConfig();
      setMsg('Logo uploaded!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Error uploading: ' + (err.response?.data?.error || 'Failed'));
    }
    setUploading(false);
  };

  const updateFeature = (index, field, value) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const addFeature = () => {
    setFeatures([...features, { icon: '⭐', title: 'New Feature', description: 'Description' }]);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const logoUrl = getLogoUrl();

  return (
    <div className="animate-fade-in">
      {msg && <div className={`alert ${msg.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

      <div className="card mb-2">
        <h4 className="mb-2">Branding</h4>
        <div className="profile-grid">
          <div className="form-group">
            <label>App Name</label>
            <input className="form-control" value={appName} onChange={(e) => setAppName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Logo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {logoUrl && <img src={logoUrl} alt="Logo" style={{ height: 40, borderRadius: 6 }} />}
              <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-2">
        <h4 className="mb-2">Homepage Content</h4>
        <div className="form-group">
          <label>Hero Title</label>
          <input className="form-control" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Hero Subtitle</label>
          <textarea className="form-control" rows="3" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
        </div>
      </div>

      <div className="card mb-2">
        <div className="flex-between mb-2">
          <h4>Feature Cards</h4>
          <button className="btn btn-outline btn-sm" onClick={addFeature}>+ Add Feature</button>
        </div>
        {features.map((f, i) => (
          <div key={i} className="card mb-1" style={{ padding: '1rem' }}>
            <div className="profile-grid">
              <div className="form-group">
                <label>Icon (emoji)</label>
                <input className="form-control" value={f.icon} onChange={(e) => updateFeature(i, 'icon', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input className="form-control" value={f.title} onChange={(e) => updateFeature(i, 'title', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input className="form-control" value={f.description} onChange={(e) => updateFeature(i, 'description', e.target.value)} />
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => removeFeature(i)}>Remove</button>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={handleSave}>Save All Changes</button>
    </div>
  );
}

/* =================== Countries =================== */
function CountriesPanel() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => { loadCountries(); }, []);

  const loadCountries = async () => {
    try {
      const res = await adminAPI.getCountries();
      setCountries(res.data.countries);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleEdit = (c) => {
    setEditing(c._id);
    setForm({
      name: c.name, code: c.code, description: c.description || '',
      minimumGPA: c.eligibilityCriteria?.academic?.minimumGPA || '',
      minimumIELTS: c.eligibilityCriteria?.language?.minimumIELTS || '',
      minimumTOEFL: c.eligibilityCriteria?.language?.minimumTOEFL || '',
      minimumBankBalance: c.eligibilityCriteria?.financial?.minimumBankBalance || '',
    });
  };

  const handleSave = async () => {
    try {
      await adminAPI.updateCountry(editing, {
        name: form.name, description: form.description,
        'eligibilityCriteria.academic.minimumGPA': Number(form.minimumGPA),
        'eligibilityCriteria.language.minimumIELTS': Number(form.minimumIELTS),
        'eligibilityCriteria.language.minimumTOEFL': Number(form.minimumTOEFL),
        'eligibilityCriteria.financial.minimumBankBalance': Number(form.minimumBankBalance),
      });
      setEditing(null);
      loadCountries();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this country?')) return;
    try { await adminAPI.deleteCountry(id); loadCountries(); } catch (err) { console.error(err); }
  };

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      <h3 className="mb-2">Manage Countries</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Country</th><th>Code</th><th>Min GPA</th><th>Min IELTS</th><th>Min Bank Balance</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((c) => (
              <tr key={c._id}>
                {editing === c._id ? (
                  <>
                    <td><input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></td>
                    <td>{form.code}</td>
                    <td><input type="number" className="form-control" value={form.minimumGPA} onChange={(e) => setForm({ ...form, minimumGPA: e.target.value })} style={{ width: 80 }} /></td>
                    <td><input type="number" className="form-control" value={form.minimumIELTS} onChange={(e) => setForm({ ...form, minimumIELTS: e.target.value })} style={{ width: 80 }} /></td>
                    <td><input type="number" className="form-control" value={form.minimumBankBalance} onChange={(e) => setForm({ ...form, minimumBankBalance: e.target.value })} style={{ width: 110 }} /></td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>{' '}
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><strong>{c.flagEmoji} {c.name}</strong></td>
                    <td>{c.code}</td>
                    <td>{c.eligibilityCriteria?.academic?.minimumGPA}</td>
                    <td>{c.eligibilityCriteria?.language?.minimumIELTS}</td>
                    <td>&euro;{c.eligibilityCriteria?.financial?.minimumBankBalance?.toLocaleString()}</td>
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

/* =================== Universities =================== */
function UniversitiesPanel() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', country: 'Germany', city: '', description: '', tuitionMin: '', tuitionMax: '', website: '' });

  useEffect(() => { loadUniversities(); }, []);

  const loadUniversities = async () => {
    try {
      const res = await adminAPI.getUniversities();
      setUniversities(res.data.universities);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleAdd = async () => {
    try {
      await adminAPI.createUniversity({
        name: addForm.name, country: addForm.country, city: addForm.city,
        description: addForm.description, website: addForm.website,
        tuitionRange: { min: Number(addForm.tuitionMin), max: Number(addForm.tuitionMax), currency: 'EUR' },
        languagesOfInstruction: ['English'], programs: [],
      });
      setShowAdd(false);
      setAddForm({ name: '', country: 'Germany', city: '', description: '', tuitionMin: '', tuitionMax: '', website: '' });
      loadUniversities();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this university?')) return;
    try { await adminAPI.deleteUniversity(id); loadUniversities(); } catch (err) { console.error(err); }
  };

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-2">
        <h3>Manage Universities</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add University</button>
      </div>

      {showAdd && (
        <div className="card mb-2">
          <h4 className="mb-2">Add New University</h4>
          <div className="profile-grid">
            <div className="form-group">
              <label>Name</label>
              <input className="form-control" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <select className="form-control" value={addForm.country} onChange={(e) => setAddForm({ ...addForm, country: e.target.value })}>
                {['Germany', 'France', 'Italy', 'Netherlands', 'Romania'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>City</label>
              <input className="form-control" value={addForm.city} onChange={(e) => setAddForm({ ...addForm, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input className="form-control" value={addForm.website} onChange={(e) => setAddForm({ ...addForm, website: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Min Tuition (EUR/yr)</label>
              <input type="number" className="form-control" value={addForm.tuitionMin} onChange={(e) => setAddForm({ ...addForm, tuitionMin: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Max Tuition (EUR/yr)</label>
              <input type="number" className="form-control" value={addForm.tuitionMax} onChange={(e) => setAddForm({ ...addForm, tuitionMax: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={handleAdd}>Add University</button>
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>University</th><th>Country</th><th>City</th><th>Tuition Range</th><th>Programs</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {universities.map((u) => (
              <tr key={u._id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.country}</td>
                <td>{u.city}</td>
                <td>&euro;{u.tuitionRange?.min?.toLocaleString()} - &euro;{u.tuitionRange?.max?.toLocaleString()}</td>
                <td>{u.programs?.length || 0}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =================== Users =================== */
function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers().then(res => { setUsers(res.data.users); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      <h3 className="mb-2">Users</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Nationality</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role === 'admin' ? 'badge-accent' : 'badge-success'}`}>{u.role}</span></td>
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

/* =================== Main Admin =================== */
export default function Admin() {
  const [stats, setStats] = useState({ users: 0, countries: 0, universities: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.stats().then(res => { setStats(res.data.stats); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const tabList = ['overview', 'themes', 'branding', 'countries', 'universities', 'users'];

  return (
    <div className="animate-fade-in">
      <h2 className="mb-2">Admin Dashboard</h2>
      <StatsPanel stats={stats} />

      <div className="tabs">
        {tabList.map(t => (
          <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-2 stagger">
          <div className="card card-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('themes')}>
            <h4>🎨 Theme Designer</h4>
            <p className="text-muted text-sm mt-1">Customize colors, fonts, buttons, and layout with live preview.</p>
          </div>
          <div className="card card-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('branding')}>
            <h4>🏷️ Branding & Content</h4>
            <p className="text-muted text-sm mt-1">Upload logo, change app name, edit homepage content.</p>
          </div>
          <div className="card card-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('countries')}>
            <h4>🌍 Manage Countries</h4>
            <p className="text-muted text-sm mt-1">Edit eligibility criteria, visa processes, and documents.</p>
          </div>
          <div className="card card-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('universities')}>
            <h4>🏛️ Manage Universities</h4>
            <p className="text-muted text-sm mt-1">Add, edit, or remove universities and programs.</p>
          </div>
        </div>
      )}
      {activeTab === 'themes' && <ThemesPanel />}
      {activeTab === 'branding' && <BrandingPanel />}
      {activeTab === 'countries' && <CountriesPanel />}
      {activeTab === 'universities' && <UniversitiesPanel />}
      {activeTab === 'users' && <UsersPanel />}
    </div>
  );
}
