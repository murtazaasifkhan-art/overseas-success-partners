import { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const COUNTRIES_LIST = ['Germany', 'France', 'Italy', 'Netherlands', 'Romania'];
const DEGREE_LEVELS = [
  { value: '', label: 'Select...' },
  { value: 'high_school', label: 'High School' },
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'phd', label: 'PhD' },
];
const TEST_TYPES = [
  { value: '', label: 'Select...' },
  { value: 'ielts', label: 'IELTS' },
  { value: 'toefl', label: 'TOEFL' },
  { value: 'duolingo', label: 'Duolingo' },
  { value: 'cambridge', label: 'Cambridge' },
  { value: 'none', label: 'None' },
];

export default function Profile() {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    age: '',
    nationality: '',
    highestDegree: '',
    gpa: '',
    gpaScale: '4.0',
    fieldOfStudy: '',
    institution: '',
    graduationYear: '',
    testType: '',
    score: '',
    budgetMin: '0',
    budgetMax: '50000',
    preferredCountries: [],
    preferredDegreeLevel: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await profileAPI.get();
      const { profile, name } = res.data;
      setForm({
        name: name || '',
        age: profile?.age || '',
        nationality: profile?.nationality || '',
        highestDegree: profile?.academicBackground?.highestDegree || '',
        gpa: profile?.academicBackground?.gpa || '',
        gpaScale: profile?.academicBackground?.gpaScale || '4.0',
        fieldOfStudy: profile?.academicBackground?.fieldOfStudy || '',
        institution: profile?.academicBackground?.institution || '',
        graduationYear: profile?.academicBackground?.graduationYear || '',
        testType: profile?.englishProficiency?.testType || '',
        score: profile?.englishProficiency?.score || '',
        budgetMin: profile?.budgetRange?.min || '0',
        budgetMax: profile?.budgetRange?.max || '50000',
        preferredCountries: profile?.preferredCountries || [],
        preferredDegreeLevel: profile?.preferredDegreeLevel || '',
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCountry = (country) => {
    setForm((prev) => ({
      ...prev,
      preferredCountries: prev.preferredCountries.includes(country)
        ? prev.preferredCountries.filter((c) => c !== country)
        : [...prev.preferredCountries, country],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await profileAPI.update({
        name: form.name,
        age: form.age ? Number(form.age) : undefined,
        nationality: form.nationality,
        academicBackground: {
          highestDegree: form.highestDegree,
          gpa: form.gpa ? Number(form.gpa) : undefined,
          gpaScale: Number(form.gpaScale),
          fieldOfStudy: form.fieldOfStudy,
          institution: form.institution,
          graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        },
        englishProficiency: {
          testType: form.testType,
          score: form.score ? Number(form.score) : undefined,
        },
        budgetRange: {
          min: Number(form.budgetMin),
          max: Number(form.budgetMax),
          currency: 'EUR',
        },
        preferredCountries: form.preferredCountries,
        preferredDegreeLevel: form.preferredDegreeLevel,
      });
      updateUser({ ...res.data, profile: res.data.profile });
      setMessage('Profile saved successfully!');
    } catch (err) {
      setMessage('Failed to save profile. Please try again.');
    }
    setSaving(false);
  };

  if (loading) return <Loading />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>My Profile</h2>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card profile-section">
          <h3>Personal Information</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" value={form.name}
                onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" className="form-control" value={form.age}
                onChange={(e) => handleChange('age', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Nationality</label>
              <input className="form-control" value={form.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                placeholder="e.g. Pakistani, Indian" />
            </div>
          </div>
        </div>

        <div className="card profile-section">
          <h3>Academic Background</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Highest Degree</label>
              <select className="form-control" value={form.highestDegree}
                onChange={(e) => handleChange('highestDegree', e.target.value)}>
                {DEGREE_LEVELS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>GPA / Grade</label>
              <input type="number" step="0.01" className="form-control" value={form.gpa}
                onChange={(e) => handleChange('gpa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>GPA Scale</label>
              <select className="form-control" value={form.gpaScale}
                onChange={(e) => handleChange('gpaScale', e.target.value)}>
                <option value="4.0">Out of 4.0</option>
                <option value="5.0">Out of 5.0</option>
                <option value="10.0">Out of 10.0</option>
                <option value="100">Out of 100 (percentage)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Field of Study</label>
              <input className="form-control" value={form.fieldOfStudy}
                onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
                placeholder="e.g. Computer Science" />
            </div>
            <div className="form-group">
              <label>Institution</label>
              <input className="form-control" value={form.institution}
                onChange={(e) => handleChange('institution', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Graduation Year</label>
              <input type="number" className="form-control" value={form.graduationYear}
                onChange={(e) => handleChange('graduationYear', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card profile-section">
          <h3>English Proficiency</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Test Type</label>
              <select className="form-control" value={form.testType}
                onChange={(e) => handleChange('testType', e.target.value)}>
                {TEST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Score</label>
              <input type="number" step="0.5" className="form-control" value={form.score}
                onChange={(e) => handleChange('score', e.target.value)}
                placeholder={form.testType === 'ielts' ? 'e.g. 7.0' : 'e.g. 90'} />
            </div>
          </div>
        </div>

        <div className="card profile-section">
          <h3>Budget & Preferences</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Minimum Budget (EUR/year)</label>
              <input type="number" className="form-control" value={form.budgetMin}
                onChange={(e) => handleChange('budgetMin', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Maximum Budget (EUR/year)</label>
              <input type="number" className="form-control" value={form.budgetMax}
                onChange={(e) => handleChange('budgetMax', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Preferred Degree Level</label>
              <select className="form-control" value={form.preferredDegreeLevel}
                onChange={(e) => handleChange('preferredDegreeLevel', e.target.value)}>
                <option value="">Select...</option>
                <option value="bachelors">Bachelor&apos;s</option>
                <option value="masters">Master&apos;s</option>
                <option value="phd">PhD</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Preferred Countries</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {COUNTRIES_LIST.map((c) => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.preferredCountries.includes(c)}
                    onChange={() => toggleCountry(c)} />
                  {c}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
