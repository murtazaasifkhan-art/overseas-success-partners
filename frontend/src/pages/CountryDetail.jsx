import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { countryAPI } from '../services/api';
import Loading from '../components/Loading';

export default function CountryDetail() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    countryAPI.get(code).then((res) => {
      setCountry(res.data.country);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [code]);

  if (loading) return <Loading />;
  if (!country) return <div className="alert alert-error">Country not found</div>;

  const criteria = country.eligibilityCriteria;
  const guide = country.studyGuide;

  return (
    <div>
      <Link to="/countries" style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Countries
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '3rem' }}>{country.flagEmoji}</span>
        <div>
          <h1>Study in {country.name}</h1>
          <p style={{ color: 'var(--gray-500)' }}>{country.description}</p>
        </div>
      </div>

      <div className="tabs">
        {['overview', 'visa', 'documents', 'timeline', 'links'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-2">
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Academic Requirements</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>Minimum Degree:</strong> {criteria?.academic?.minimumDegree?.replace('_', ' ')}
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>Minimum GPA:</strong> {criteria?.academic?.minimumGPA}/{criteria?.academic?.gpaScale}
              </li>
              {criteria?.academic?.notes && (
                <li style={{ padding: '0.4rem 0', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                  {criteria.academic.notes}
                </li>
              )}
            </ul>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Language Requirements</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>IELTS:</strong> {criteria?.language?.minimumIELTS}+
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>TOEFL:</strong> {criteria?.language?.minimumTOEFL}+
              </li>
              {criteria?.language?.localLanguageRequired && (
                <li style={{ padding: '0.4rem 0' }}>
                  <strong>{criteria.language.localLanguage}:</strong> {criteria.language.localLanguageLevel}
                </li>
              )}
              {criteria?.language?.notes && (
                <li style={{ padding: '0.4rem 0', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                  {criteria.language.notes}
                </li>
              )}
            </ul>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Financial Requirements</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>Proof Required:</strong> €{criteria?.financial?.minimumBankBalance?.toLocaleString()}+
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>Tuition:</strong> €{criteria?.financial?.averageTuitionMin?.toLocaleString()} - €{criteria?.financial?.averageTuitionMax?.toLocaleString()}/year
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>Living Costs:</strong> ~€{criteria?.financial?.averageLivingCostPerYear?.toLocaleString()}/year
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>Scholarships:</strong>{' '}
                <span className={criteria?.financial?.scholarshipsAvailable ? 'badge badge-success' : 'badge badge-danger'}>
                  {criteria?.financial?.scholarshipsAvailable ? 'Available' : 'Limited'}
                </span>
              </li>
              {criteria?.financial?.notes && (
                <li style={{ padding: '0.4rem 0', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                  {criteria.financial.notes}
                </li>
              )}
            </ul>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Visa Information</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>Processing Time:</strong> {criteria?.visa?.processingTimeWeeks?.min}-{criteria?.visa?.processingTimeWeeks?.max} weeks
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>Work Allowed:</strong> {criteria?.visa?.workPermitWithStudy ? `Yes (${criteria.visa.maxWorkHoursPerWeek}h/week)` : 'No'}
              </li>
              <li style={{ padding: '0.4rem 0' }}>
                <strong>Health Insurance:</strong> {criteria?.visa?.healthInsuranceRequired ? 'Required' : 'Optional'}
              </li>
              {criteria?.visa?.notes && (
                <li style={{ padding: '0.4rem 0', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                  {criteria.visa.notes}
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {tab === 'visa' && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Step-by-Step Visa Process</h3>
          <div className="guide-steps">
            {guide?.visaProcess?.map((step) => (
              <div key={step.step} className="guide-step">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'documents' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Required Documents</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            {guide?.requiredDocuments?.map((doc, i) => (
              <li key={i} style={{ padding: '0.4rem 0' }}>{doc}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'timeline' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Application Timeline</h3>
          <div>
            {guide?.applicationTimeline?.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '1rem', padding: '0.75rem 0',
                borderBottom: i < guide.applicationTimeline.length - 1 ? '1px solid var(--gray-100)' : 'none',
              }}>
                <strong style={{ minWidth: '160px', color: 'var(--primary)' }}>{item.month}</strong>
                <span>{item.activity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'links' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Official Resources</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {guide?.officialLinks?.map((link, i) => (
              <li key={i} style={{ padding: '0.5rem 0' }}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.title} &rarr;
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link to="/universities" className="btn btn-primary">
          Browse Universities in {country.name}
        </Link>
      </div>
    </div>
  );
}
