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
function CountryForm({ initial, onSave, onCancel, saving }) {
  const empty = {
    name: '', code: '', flagEmoji: '', description: '',
    eligibilityCriteria: {
      academic: { minimumDegree: 'high_school', minimumGPA: '', gpaScale: 4, notes: '' },
      language: { englishRequired: true, minimumIELTS: '', minimumTOEFL: '', localLanguageRequired: false, localLanguage: '', localLanguageLevel: '', notes: '' },
      financial: { proofRequired: true, minimumBankBalance: '', currency: 'EUR', scholarshipsAvailable: false, averageTuitionMin: '', averageTuitionMax: '', averageLivingCostPerYear: '', notes: '' },
      visa: { studentVisaRequired: true, processingTimeWeeksMin: '', processingTimeWeeksMax: '', workPermitWithStudy: false, maxWorkHoursPerWeek: '', healthInsuranceRequired: true, notes: '' },
    },
    studyGuide: { visaProcess: [], requiredDocuments: [], applicationTimeline: [], officialLinks: [] },
  };

  const [form, setForm] = useState(() => {
    if (!initial) return empty;
    return {
      name: initial.name || '', code: initial.code || '', flagEmoji: initial.flagEmoji || '', description: initial.description || '',
      eligibilityCriteria: {
        academic: { minimumDegree: initial.eligibilityCriteria?.academic?.minimumDegree || 'high_school', minimumGPA: initial.eligibilityCriteria?.academic?.minimumGPA || '', gpaScale: initial.eligibilityCriteria?.academic?.gpaScale || 4, notes: initial.eligibilityCriteria?.academic?.notes || '' },
        language: { englishRequired: initial.eligibilityCriteria?.language?.englishRequired ?? true, minimumIELTS: initial.eligibilityCriteria?.language?.minimumIELTS || '', minimumTOEFL: initial.eligibilityCriteria?.language?.minimumTOEFL || '', localLanguageRequired: initial.eligibilityCriteria?.language?.localLanguageRequired || false, localLanguage: initial.eligibilityCriteria?.language?.localLanguage || '', localLanguageLevel: initial.eligibilityCriteria?.language?.localLanguageLevel || '', notes: initial.eligibilityCriteria?.language?.notes || '' },
        financial: { proofRequired: initial.eligibilityCriteria?.financial?.proofRequired ?? true, minimumBankBalance: initial.eligibilityCriteria?.financial?.minimumBankBalance || '', currency: initial.eligibilityCriteria?.financial?.currency || 'EUR', scholarshipsAvailable: initial.eligibilityCriteria?.financial?.scholarshipsAvailable || false, averageTuitionMin: initial.eligibilityCriteria?.financial?.averageTuitionMin || '', averageTuitionMax: initial.eligibilityCriteria?.financial?.averageTuitionMax || '', averageLivingCostPerYear: initial.eligibilityCriteria?.financial?.averageLivingCostPerYear || '', notes: initial.eligibilityCriteria?.financial?.notes || '' },
        visa: { studentVisaRequired: initial.eligibilityCriteria?.visa?.studentVisaRequired ?? true, processingTimeWeeksMin: initial.eligibilityCriteria?.visa?.processingTimeWeeks?.min || '', processingTimeWeeksMax: initial.eligibilityCriteria?.visa?.processingTimeWeeks?.max || '', workPermitWithStudy: initial.eligibilityCriteria?.visa?.workPermitWithStudy || false, maxWorkHoursPerWeek: initial.eligibilityCriteria?.visa?.maxWorkHoursPerWeek || '', healthInsuranceRequired: initial.eligibilityCriteria?.visa?.healthInsuranceRequired ?? true, notes: initial.eligibilityCriteria?.visa?.notes || '' },
      },
      studyGuide: {
        visaProcess: initial.studyGuide?.visaProcess || [],
        requiredDocuments: initial.studyGuide?.requiredDocuments || [],
        applicationTimeline: initial.studyGuide?.applicationTimeline || [],
        officialLinks: initial.studyGuide?.officialLinks || [],
      },
    };
  });

  const [activeSection, setActiveSection] = useState('basic');
  const [newDoc, setNewDoc] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [newStep, setNewStep] = useState({ title: '', description: '' });
  const [newTimeline, setNewTimeline] = useState({ month: '', activity: '' });

  const updateNested = (path, value) => {
    const keys = path.split('.');
    setForm(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handleSubmit = () => {
    const data = JSON.parse(JSON.stringify(form));
    const ec = data.eligibilityCriteria;
    ec.academic.minimumGPA = ec.academic.minimumGPA ? Number(ec.academic.minimumGPA) : undefined;
    ec.academic.gpaScale = Number(ec.academic.gpaScale);
    ec.language.minimumIELTS = ec.language.minimumIELTS ? Number(ec.language.minimumIELTS) : undefined;
    ec.language.minimumTOEFL = ec.language.minimumTOEFL ? Number(ec.language.minimumTOEFL) : undefined;
    ec.financial.minimumBankBalance = ec.financial.minimumBankBalance ? Number(ec.financial.minimumBankBalance) : undefined;
    ec.financial.averageTuitionMin = ec.financial.averageTuitionMin ? Number(ec.financial.averageTuitionMin) : undefined;
    ec.financial.averageTuitionMax = ec.financial.averageTuitionMax ? Number(ec.financial.averageTuitionMax) : undefined;
    ec.financial.averageLivingCostPerYear = ec.financial.averageLivingCostPerYear ? Number(ec.financial.averageLivingCostPerYear) : undefined;
    ec.visa.processingTimeWeeks = { min: Number(ec.visa.processingTimeWeeksMin) || undefined, max: Number(ec.visa.processingTimeWeeksMax) || undefined };
    delete ec.visa.processingTimeWeeksMin;
    delete ec.visa.processingTimeWeeksMax;
    ec.visa.maxWorkHoursPerWeek = ec.visa.maxWorkHoursPerWeek ? Number(ec.visa.maxWorkHoursPerWeek) : undefined;
    onSave(data);
  };

  const sections = ['basic', 'academic', 'language', 'financial', 'visa', 'documents', 'links'];

  return (
    <div className="card mb-2">
      <div className="tabs mb-2" style={{ flexWrap: 'wrap' }}>
        {sections.map(s => (
          <button key={s} className={`tab ${activeSection === s ? 'active' : ''}`} onClick={() => setActiveSection(s)}>
            {s === 'basic' ? 'Basic Info' : s === 'academic' ? 'Academic' : s === 'language' ? 'Language' : s === 'financial' ? 'Financial' : s === 'visa' ? 'Visa' : s === 'documents' ? 'Documents & Steps' : 'Official Links'}
          </button>
        ))}
      </div>

      {activeSection === 'basic' && (
        <div className="profile-grid">
          <div className="form-group"><label>Country Name *</label><input className="form-control" value={form.name} onChange={e => updateNested('name', e.target.value)} placeholder="e.g. Germany" /></div>
          <div className="form-group"><label>Country Code * (2-letter)</label><input className="form-control" value={form.code} onChange={e => updateNested('code', e.target.value.toUpperCase())} placeholder="e.g. DE" maxLength={3} /></div>
          <div className="form-group"><label>Flag Emoji</label><input className="form-control" value={form.flagEmoji} onChange={e => updateNested('flagEmoji', e.target.value)} placeholder="e.g. 🇩🇪" /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e => updateNested('description', e.target.value)} placeholder="Brief description about studying in this country..." /></div>
        </div>
      )}

      {activeSection === 'academic' && (
        <div className="profile-grid">
          <div className="form-group"><label>Minimum Degree</label>
            <select className="form-control" value={form.eligibilityCriteria.academic.minimumDegree} onChange={e => updateNested('eligibilityCriteria.academic.minimumDegree', e.target.value)}>
              <option value="high_school">High School</option><option value="bachelors">Bachelors</option><option value="masters">Masters</option>
            </select>
          </div>
          <div className="form-group"><label>Minimum GPA</label><input type="number" step="0.1" className="form-control" value={form.eligibilityCriteria.academic.minimumGPA} onChange={e => updateNested('eligibilityCriteria.academic.minimumGPA', e.target.value)} placeholder="e.g. 2.5" /></div>
          <div className="form-group"><label>GPA Scale</label><input type="number" className="form-control" value={form.eligibilityCriteria.academic.gpaScale} onChange={e => updateNested('eligibilityCriteria.academic.gpaScale', e.target.value)} placeholder="4.0" /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Academic Notes</label><textarea className="form-control" rows={2} value={form.eligibilityCriteria.academic.notes} onChange={e => updateNested('eligibilityCriteria.academic.notes', e.target.value)} placeholder="Additional notes about academic requirements..." /></div>
        </div>
      )}

      {activeSection === 'language' && (
        <div className="profile-grid">
          <div className="form-group"><label><input type="checkbox" checked={form.eligibilityCriteria.language.englishRequired} onChange={e => updateNested('eligibilityCriteria.language.englishRequired', e.target.checked)} /> English Required</label></div>
          <div className="form-group"><label>Min IELTS Score</label><input type="number" step="0.5" className="form-control" value={form.eligibilityCriteria.language.minimumIELTS} onChange={e => updateNested('eligibilityCriteria.language.minimumIELTS', e.target.value)} placeholder="e.g. 6.0" /></div>
          <div className="form-group"><label>Min TOEFL Score</label><input type="number" className="form-control" value={form.eligibilityCriteria.language.minimumTOEFL} onChange={e => updateNested('eligibilityCriteria.language.minimumTOEFL', e.target.value)} placeholder="e.g. 80" /></div>
          <div className="form-group"><label><input type="checkbox" checked={form.eligibilityCriteria.language.localLanguageRequired} onChange={e => updateNested('eligibilityCriteria.language.localLanguageRequired', e.target.checked)} /> Local Language Required</label></div>
          <div className="form-group"><label>Local Language Name</label><input className="form-control" value={form.eligibilityCriteria.language.localLanguage} onChange={e => updateNested('eligibilityCriteria.language.localLanguage', e.target.value)} placeholder="e.g. German" /></div>
          <div className="form-group"><label>Local Language Level</label><input className="form-control" value={form.eligibilityCriteria.language.localLanguageLevel} onChange={e => updateNested('eligibilityCriteria.language.localLanguageLevel', e.target.value)} placeholder="e.g. B1" /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Language Notes</label><textarea className="form-control" rows={2} value={form.eligibilityCriteria.language.notes} onChange={e => updateNested('eligibilityCriteria.language.notes', e.target.value)} /></div>
        </div>
      )}

      {activeSection === 'financial' && (
        <div className="profile-grid">
          <div className="form-group"><label><input type="checkbox" checked={form.eligibilityCriteria.financial.proofRequired} onChange={e => updateNested('eligibilityCriteria.financial.proofRequired', e.target.checked)} /> Financial Proof Required</label></div>
          <div className="form-group"><label>Minimum Bank Balance</label><input type="number" className="form-control" value={form.eligibilityCriteria.financial.minimumBankBalance} onChange={e => updateNested('eligibilityCriteria.financial.minimumBankBalance', e.target.value)} placeholder="e.g. 11208" /></div>
          <div className="form-group"><label>Currency</label><input className="form-control" value={form.eligibilityCriteria.financial.currency} onChange={e => updateNested('eligibilityCriteria.financial.currency', e.target.value)} placeholder="EUR" /></div>
          <div className="form-group"><label><input type="checkbox" checked={form.eligibilityCriteria.financial.scholarshipsAvailable} onChange={e => updateNested('eligibilityCriteria.financial.scholarshipsAvailable', e.target.checked)} /> Scholarships Available</label></div>
          <div className="form-group"><label>Avg Tuition Min (per year)</label><input type="number" className="form-control" value={form.eligibilityCriteria.financial.averageTuitionMin} onChange={e => updateNested('eligibilityCriteria.financial.averageTuitionMin', e.target.value)} /></div>
          <div className="form-group"><label>Avg Tuition Max (per year)</label><input type="number" className="form-control" value={form.eligibilityCriteria.financial.averageTuitionMax} onChange={e => updateNested('eligibilityCriteria.financial.averageTuitionMax', e.target.value)} /></div>
          <div className="form-group"><label>Avg Living Cost (per year)</label><input type="number" className="form-control" value={form.eligibilityCriteria.financial.averageLivingCostPerYear} onChange={e => updateNested('eligibilityCriteria.financial.averageLivingCostPerYear', e.target.value)} /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Financial Notes</label><textarea className="form-control" rows={2} value={form.eligibilityCriteria.financial.notes} onChange={e => updateNested('eligibilityCriteria.financial.notes', e.target.value)} /></div>
        </div>
      )}

      {activeSection === 'visa' && (
        <div className="profile-grid">
          <div className="form-group"><label><input type="checkbox" checked={form.eligibilityCriteria.visa.studentVisaRequired} onChange={e => updateNested('eligibilityCriteria.visa.studentVisaRequired', e.target.checked)} /> Student Visa Required</label></div>
          <div className="form-group"><label>Processing Time (min weeks)</label><input type="number" className="form-control" value={form.eligibilityCriteria.visa.processingTimeWeeksMin} onChange={e => updateNested('eligibilityCriteria.visa.processingTimeWeeksMin', e.target.value)} /></div>
          <div className="form-group"><label>Processing Time (max weeks)</label><input type="number" className="form-control" value={form.eligibilityCriteria.visa.processingTimeWeeksMax} onChange={e => updateNested('eligibilityCriteria.visa.processingTimeWeeksMax', e.target.value)} /></div>
          <div className="form-group"><label><input type="checkbox" checked={form.eligibilityCriteria.visa.workPermitWithStudy} onChange={e => updateNested('eligibilityCriteria.visa.workPermitWithStudy', e.target.checked)} /> Work Permit With Study</label></div>
          <div className="form-group"><label>Max Work Hours/Week</label><input type="number" className="form-control" value={form.eligibilityCriteria.visa.maxWorkHoursPerWeek} onChange={e => updateNested('eligibilityCriteria.visa.maxWorkHoursPerWeek', e.target.value)} /></div>
          <div className="form-group"><label><input type="checkbox" checked={form.eligibilityCriteria.visa.healthInsuranceRequired} onChange={e => updateNested('eligibilityCriteria.visa.healthInsuranceRequired', e.target.checked)} /> Health Insurance Required</label></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Visa Notes</label><textarea className="form-control" rows={2} value={form.eligibilityCriteria.visa.notes} onChange={e => updateNested('eligibilityCriteria.visa.notes', e.target.value)} /></div>
        </div>
      )}

      {activeSection === 'documents' && (
        <div>
          <h4 className="mb-1">Required Documents</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {form.studyGuide.requiredDocuments.map((doc, i) => (
              <span key={i} className="badge badge-primary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {doc} <span onClick={() => { const docs = [...form.studyGuide.requiredDocuments]; docs.splice(i, 1); updateNested('studyGuide.requiredDocuments', docs); }} style={{ fontWeight: 'bold' }}>&times;</span>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input className="form-control" value={newDoc} onChange={e => setNewDoc(e.target.value)} placeholder="e.g. Valid Passport" style={{ flex: 1 }} />
            <button className="btn btn-outline btn-sm" onClick={() => { if (newDoc.trim()) { updateNested('studyGuide.requiredDocuments', [...form.studyGuide.requiredDocuments, newDoc.trim()]); setNewDoc(''); } }}>Add</button>
          </div>

          <h4 className="mb-1">Visa Process Steps</h4>
          {form.studyGuide.visaProcess.map((s, i) => (
            <div key={i} className="card mb-1" style={{ padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Step {s.step}: {s.title}</strong>
                <button className="btn btn-danger btn-sm" onClick={() => { const steps = [...form.studyGuide.visaProcess]; steps.splice(i, 1); updateNested('studyGuide.visaProcess', steps); }}>Remove</button>
              </div>
              <p className="text-sm text-muted mt-1">{s.description}</p>
            </div>
          ))}
          <div className="profile-grid" style={{ marginTop: '0.75rem' }}>
            <div className="form-group"><label>Step Title</label><input className="form-control" value={newStep.title} onChange={e => setNewStep({ ...newStep, title: e.target.value })} placeholder="e.g. Apply to University" /></div>
            <div className="form-group"><label>Description</label><input className="form-control" value={newStep.description} onChange={e => setNewStep({ ...newStep, description: e.target.value })} placeholder="Detailed description..." /></div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => { if (newStep.title) { updateNested('studyGuide.visaProcess', [...form.studyGuide.visaProcess, { step: form.studyGuide.visaProcess.length + 1, ...newStep }]); setNewStep({ title: '', description: '' }); } }}>Add Step</button>

          <h4 className="mb-1 mt-2">Application Timeline</h4>
          {form.studyGuide.applicationTimeline.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <strong style={{ minWidth: '100px' }}>{t.month}:</strong> <span>{t.activity}</span>
              <button className="btn btn-danger btn-sm" onClick={() => { const tl = [...form.studyGuide.applicationTimeline]; tl.splice(i, 1); updateNested('studyGuide.applicationTimeline', tl); }}>x</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input className="form-control" value={newTimeline.month} onChange={e => setNewTimeline({ ...newTimeline, month: e.target.value })} placeholder="Month (e.g. January)" style={{ width: '140px' }} />
            <input className="form-control" value={newTimeline.activity} onChange={e => setNewTimeline({ ...newTimeline, activity: e.target.value })} placeholder="Activity" style={{ flex: 1 }} />
            <button className="btn btn-outline btn-sm" onClick={() => { if (newTimeline.month && newTimeline.activity) { updateNested('studyGuide.applicationTimeline', [...form.studyGuide.applicationTimeline, newTimeline]); setNewTimeline({ month: '', activity: '' }); } }}>Add</button>
          </div>
        </div>
      )}

      {activeSection === 'links' && (
        <div>
          <h4 className="mb-1">Official Website Links</h4>
          <p className="text-sm text-muted mb-2">Add links to official immigration portals, education websites, and embassy pages for quick reference and requirement updates.</p>
          {form.studyGuide.officialLinks.map((link, i) => (
            <div key={i} className="card mb-1" style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{link.title}</strong>
                <br /><a href={link.url} target="_blank" rel="noreferrer" className="text-sm" style={{ color: 'var(--color-primary)' }}>{link.url}</a>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => { const links = [...form.studyGuide.officialLinks]; links.splice(i, 1); updateNested('studyGuide.officialLinks', links); }}>Remove</button>
            </div>
          ))}
          <div className="profile-grid" style={{ marginTop: '0.75rem' }}>
            <div className="form-group"><label>Link Title</label><input className="form-control" value={newLink.title} onChange={e => setNewLink({ ...newLink, title: e.target.value })} placeholder="e.g. DAAD Official Portal" /></div>
            <div className="form-group"><label>URL</label><input className="form-control" value={newLink.url} onChange={e => setNewLink({ ...newLink, url: e.target.value })} placeholder="https://www.daad.de" /></div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => { if (newLink.title && newLink.url) { updateNested('studyGuide.officialLinks', [...form.studyGuide.officialLinks, { ...newLink }]); setNewLink({ title: '', url: '' }); } }}>Add Link</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || !form.name || !form.code}>{saving ? 'Saving...' : 'Save Country'}</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function CountriesPanel() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { loadCountries(); }, []);

  const loadCountries = async () => {
    try {
      const res = await adminAPI.getCountries();
      setCountries(res.data.countries);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await adminAPI.createCountry(data);
      setMsg('Country added successfully!');
      setAdding(false);
      loadCountries();
    } catch (err) { setMsg('Error: ' + (err.response?.data?.error || 'Failed to create')); }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      await adminAPI.updateCountry(editing, data);
      setMsg('Country updated successfully!');
      setEditing(null);
      loadCountries();
    } catch (err) { setMsg('Error: ' + (err.response?.data?.error || 'Failed to update')); }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try { await adminAPI.deleteCountry(id); setMsg(`${name} deleted`); loadCountries(); } catch (err) { console.error(err); }
    setTimeout(() => setMsg(''), 3000);
  };

  if (loading) return <Loading />;

  const filtered = countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  if (adding) return (
    <div className="animate-fade-in">
      <h3 className="mb-2">Add New Country</h3>
      <CountryForm onSave={handleCreate} onCancel={() => setAdding(false)} saving={saving} />
    </div>
  );

  if (editing) {
    const country = countries.find(c => c._id === editing);
    return (
      <div className="animate-fade-in">
        <h3 className="mb-2">Edit: {country?.name}</h3>
        <CountryForm initial={country} onSave={handleUpdate} onCancel={() => setEditing(null)} saving={saving} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-2">
        <h3>Manage Countries ({countries.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>+ Add Country</button>
      </div>

      {msg && <div className="card mb-2" style={{ padding: '0.75rem', background: msg.startsWith('Error') ? '#fde2e2' : '#d4edda', color: msg.startsWith('Error') ? '#721c24' : '#155724' }}>{msg}</div>}

      <div className="form-group mb-2">
        <input className="form-control" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search countries by name or code..." />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Country</th><th>Code</th><th>Min GPA</th><th>IELTS</th><th>Bank Balance</th><th>Official Links</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c._id}>
                <td><strong>{c.flagEmoji} {c.name}</strong></td>
                <td>{c.code}</td>
                <td>{c.eligibilityCriteria?.academic?.minimumGPA || '-'}</td>
                <td>{c.eligibilityCriteria?.language?.minimumIELTS || '-'}</td>
                <td>{c.eligibilityCriteria?.financial?.minimumBankBalance ? `${c.eligibilityCriteria.financial.currency || '€'}${c.eligibilityCriteria.financial.minimumBankBalance.toLocaleString()}` : '-'}</td>
                <td>{c.studyGuide?.officialLinks?.length || 0} links</td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(c._id)}>Edit</button>{' '}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id, c.name)}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No countries found. Click "+ Add Country" to add one.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =================== Universities =================== */
function UniversityForm({ initial, countries, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() => {
    if (!initial) return { name: '', country: '', city: '', website: '', ranking: '', description: '', tuitionMin: '', tuitionMax: '', currency: 'EUR', languagesOfInstruction: ['English'], scholarshipsAvailable: false, applicationDeadline: '', programs: [] };
    return {
      name: initial.name || '', country: initial.country || '', city: initial.city || '', website: initial.website || '', ranking: initial.ranking || '', description: initial.description || '',
      tuitionMin: initial.tuitionRange?.min || '', tuitionMax: initial.tuitionRange?.max || '', currency: initial.tuitionRange?.currency || 'EUR',
      languagesOfInstruction: initial.languagesOfInstruction || ['English'], scholarshipsAvailable: initial.scholarshipsAvailable || false,
      applicationDeadline: initial.applicationDeadline || '', programs: initial.programs || [],
    };
  });

  const [newProgram, setNewProgram] = useState({ name: '', level: 'bachelors', field: '', duration: '', language: 'English', tuitionFeePerYear: '', requirements: '' });
  const [newLang, setNewLang] = useState('');
  const [showProgForm, setShowProgForm] = useState(false);

  const handleSubmit = () => {
    const data = {
      name: form.name, country: form.country, city: form.city, website: form.website, description: form.description,
      ranking: form.ranking ? Number(form.ranking) : undefined,
      tuitionRange: { min: Number(form.tuitionMin) || 0, max: Number(form.tuitionMax) || 0, currency: form.currency },
      languagesOfInstruction: form.languagesOfInstruction, scholarshipsAvailable: form.scholarshipsAvailable,
      applicationDeadline: form.applicationDeadline, programs: form.programs,
    };
    onSave(data);
  };

  const addProgram = () => {
    const prog = { ...newProgram, tuitionFeePerYear: Number(newProgram.tuitionFeePerYear) || 0 };
    setForm({ ...form, programs: [...form.programs, prog] });
    setNewProgram({ name: '', level: 'bachelors', field: '', duration: '', language: 'English', tuitionFeePerYear: '', requirements: '' });
    setShowProgForm(false);
  };

  const removeProgram = (i) => {
    const progs = [...form.programs];
    progs.splice(i, 1);
    setForm({ ...form, programs: progs });
  };

  return (
    <div className="card mb-2">
      <h4 className="mb-2">University Details</h4>
      <div className="profile-grid">
        <div className="form-group"><label>University Name *</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Technical University of Munich" /></div>
        <div className="form-group"><label>Country *</label>
          {countries.length > 0 ? (
            <select className="form-control" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
              <option value="">Select Country</option>
              {countries.map(c => <option key={c._id} value={c.name}>{c.flagEmoji} {c.name}</option>)}
            </select>
          ) : (
            <input className="form-control" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="e.g. Germany" />
          )}
        </div>
        <div className="form-group"><label>City</label><input className="form-control" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="e.g. Munich" /></div>
        <div className="form-group"><label>Website URL</label><input className="form-control" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://www.tum.de" /></div>
        <div className="form-group"><label>World Ranking</label><input type="number" className="form-control" value={form.ranking} onChange={e => setForm({ ...form, ranking: e.target.value })} placeholder="e.g. 50" /></div>
        <div className="form-group"><label>Application Deadline</label><input className="form-control" value={form.applicationDeadline} onChange={e => setForm({ ...form, applicationDeadline: e.target.value })} placeholder="e.g. July 15 / Rolling" /></div>
        <div className="form-group"><label>Min Tuition ({form.currency}/yr)</label><input type="number" className="form-control" value={form.tuitionMin} onChange={e => setForm({ ...form, tuitionMin: e.target.value })} placeholder="0" /></div>
        <div className="form-group"><label>Max Tuition ({form.currency}/yr)</label><input type="number" className="form-control" value={form.tuitionMax} onChange={e => setForm({ ...form, tuitionMax: e.target.value })} placeholder="15000" /></div>
        <div className="form-group"><label>Currency</label><input className="form-control" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} placeholder="EUR" style={{ width: '100px' }} /></div>
        <div className="form-group"><label><input type="checkbox" checked={form.scholarshipsAvailable} onChange={e => setForm({ ...form, scholarshipsAvailable: e.target.checked })} /> Scholarships Available</label></div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description about this university..." /></div>
      </div>

      <h4 className="mb-1 mt-2">Languages of Instruction</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {form.languagesOfInstruction.map((lang, i) => (
          <span key={i} className="badge badge-primary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {lang} <span onClick={() => { const langs = [...form.languagesOfInstruction]; langs.splice(i, 1); setForm({ ...form, languagesOfInstruction: langs }); }} style={{ fontWeight: 'bold' }}>&times;</span>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input className="form-control" value={newLang} onChange={e => setNewLang(e.target.value)} placeholder="e.g. German" style={{ width: '200px' }} />
        <button className="btn btn-outline btn-sm" onClick={() => { if (newLang.trim()) { setForm({ ...form, languagesOfInstruction: [...form.languagesOfInstruction, newLang.trim()] }); setNewLang(''); } }}>Add Language</button>
      </div>

      <div className="flex-between mb-1">
        <h4>Programs ({form.programs.length})</h4>
        <button className="btn btn-outline btn-sm" onClick={() => setShowProgForm(!showProgForm)}>{showProgForm ? 'Cancel' : '+ Add Program'}</button>
      </div>

      {showProgForm && (
        <div className="card mb-1" style={{ padding: '1rem', background: 'var(--color-surface)' }}>
          <div className="profile-grid">
            <div className="form-group"><label>Program Name *</label><input className="form-control" value={newProgram.name} onChange={e => setNewProgram({ ...newProgram, name: e.target.value })} placeholder="e.g. Computer Science" /></div>
            <div className="form-group"><label>Level</label>
              <select className="form-control" value={newProgram.level} onChange={e => setNewProgram({ ...newProgram, level: e.target.value })}>
                <option value="bachelors">Bachelors</option><option value="masters">Masters</option><option value="phd">PhD</option>
              </select>
            </div>
            <div className="form-group"><label>Field</label><input className="form-control" value={newProgram.field} onChange={e => setNewProgram({ ...newProgram, field: e.target.value })} placeholder="e.g. Engineering" /></div>
            <div className="form-group"><label>Duration</label><input className="form-control" value={newProgram.duration} onChange={e => setNewProgram({ ...newProgram, duration: e.target.value })} placeholder="e.g. 2 years" /></div>
            <div className="form-group"><label>Language</label><input className="form-control" value={newProgram.language} onChange={e => setNewProgram({ ...newProgram, language: e.target.value })} placeholder="English" /></div>
            <div className="form-group"><label>Tuition Fee/Year</label><input type="number" className="form-control" value={newProgram.tuitionFeePerYear} onChange={e => setNewProgram({ ...newProgram, tuitionFeePerYear: e.target.value })} placeholder="0" /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Requirements</label><input className="form-control" value={newProgram.requirements} onChange={e => setNewProgram({ ...newProgram, requirements: e.target.value })} placeholder="e.g. BSc in related field, GPA 3.0+" /></div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={addProgram} disabled={!newProgram.name}>Add Program</button>
        </div>
      )}

      {form.programs.map((p, i) => (
        <div key={i} className="card mb-1" style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{p.name}</strong> <span className="badge badge-primary" style={{ marginLeft: '0.5rem' }}>{p.level}</span>
            <br /><span className="text-sm text-muted">{p.field} | {p.duration} | {p.language} | {p.tuitionFeePerYear ? `€${p.tuitionFeePerYear.toLocaleString()}/yr` : 'Free'}</span>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => removeProgram(i)}>Remove</button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || !form.name || !form.country}>{saving ? 'Saving...' : 'Save University'}</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function UniversitiesPanel() {
  const [universities, setUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [uniRes, countryRes] = await Promise.all([adminAPI.getUniversities(), adminAPI.getCountries()]);
      setUniversities(uniRes.data.universities);
      setCountries(countryRes.data.countries);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await adminAPI.createUniversity(data);
      setMsg('University added!');
      setAdding(false);
      loadData();
    } catch (err) { setMsg('Error: ' + (err.response?.data?.error || 'Failed to create')); }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      await adminAPI.updateUniversity(editing, data);
      setMsg('University updated!');
      setEditing(null);
      loadData();
    } catch (err) { setMsg('Error: ' + (err.response?.data?.error || 'Failed to update')); }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try { await adminAPI.deleteUniversity(id); setMsg(`${name} deleted`); loadData(); } catch (err) { console.error(err); }
    setTimeout(() => setMsg(''), 3000);
  };

  if (loading) return <Loading />;

  const filtered = universities.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.city?.toLowerCase().includes(search.toLowerCase());
    const matchCountry = !filterCountry || u.country === filterCountry;
    return matchSearch && matchCountry;
  });

  const countryNames = [...new Set(universities.map(u => u.country))].sort();

  if (adding) return (
    <div className="animate-fade-in">
      <h3 className="mb-2">Add New University</h3>
      <UniversityForm countries={countries} onSave={handleCreate} onCancel={() => setAdding(false)} saving={saving} />
    </div>
  );

  if (editing) {
    const uni = universities.find(u => u._id === editing);
    return (
      <div className="animate-fade-in">
        <h3 className="mb-2">Edit: {uni?.name}</h3>
        <UniversityForm initial={uni} countries={countries} onSave={handleUpdate} onCancel={() => setEditing(null)} saving={saving} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-2">
        <h3>Manage Universities ({universities.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>+ Add University</button>
      </div>

      {msg && <div className="card mb-2" style={{ padding: '0.75rem', background: msg.startsWith('Error') ? '#fde2e2' : '#d4edda', color: msg.startsWith('Error') ? '#721c24' : '#155724' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <input className="form-control" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or city..." style={{ flex: 1 }} />
        <select className="form-control" value={filterCountry} onChange={e => setFilterCountry(e.target.value)} style={{ width: '200px' }}>
          <option value="">All Countries</option>
          {countryNames.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>University</th><th>Country</th><th>City</th><th>Website</th><th>Tuition</th><th>Programs</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id}>
                <td><strong>{u.name}</strong>{u.ranking ? <span className="text-sm text-muted"> (#{u.ranking})</span> : ''}</td>
                <td>{u.country}</td>
                <td>{u.city || '-'}</td>
                <td>{u.website ? <a href={u.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>Visit</a> : '-'}</td>
                <td>{u.tuitionRange?.max ? `€${u.tuitionRange.min?.toLocaleString()}-€${u.tuitionRange.max?.toLocaleString()}` : '-'}</td>
                <td>{u.programs?.length || 0}</td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(u._id)}>Edit</button>{' '}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id, u.name)}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No universities found. Click "+ Add University" to add one.</td></tr>}
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
