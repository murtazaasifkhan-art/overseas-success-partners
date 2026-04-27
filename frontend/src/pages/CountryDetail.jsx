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
    <div className="animate-fade-in country-detail-page">
      <img src={`https://flagcdn.com/w640/${country.code.toLowerCase()}.png`} alt="" className="country-bg-flag" aria-hidden="true" />
      <Link to="/countries" className="back-link">&larr; Back to Countries</Link>

      <div className="country-detail-header">
        <img src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`} alt={country.name} className="flag-img-xl" />
        <div>
          <h1>Study in {country.name}</h1>
          <p>{country.description}</p>
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
        <div className="criteria-grid stagger">
          <div className="card criteria-card">
            <h4>📚 Academic Requirements</h4>
            <ul>
              <li>Minimum Degree: {criteria?.academic?.minimumDegree?.replace('_', ' ')}</li>
              <li>Minimum GPA: {criteria?.academic?.minimumGPA}/{criteria?.academic?.gpaScale}</li>
              {criteria?.academic?.notes && <li>{criteria.academic.notes}</li>}
            </ul>
          </div>
          <div className="card criteria-card">
            <h4>🌐 Language Requirements</h4>
            <ul>
              <li>IELTS: {criteria?.language?.minimumIELTS}+</li>
              <li>TOEFL: {criteria?.language?.minimumTOEFL}+</li>
              {criteria?.language?.localLanguageRequired && (
                <li>{criteria.language.localLanguage}: {criteria.language.localLanguageLevel}</li>
              )}
              {criteria?.language?.notes && <li>{criteria.language.notes}</li>}
            </ul>
          </div>
          <div className="card criteria-card">
            <h4>💰 Financial Requirements</h4>
            <ul>
              <li>Proof Required: &euro;{criteria?.financial?.minimumBankBalance?.toLocaleString()}+</li>
              <li>Tuition: &euro;{criteria?.financial?.averageTuitionMin?.toLocaleString()} - &euro;{criteria?.financial?.averageTuitionMax?.toLocaleString()}/yr</li>
              <li>Living Costs: ~&euro;{criteria?.financial?.averageLivingCostPerYear?.toLocaleString()}/yr</li>
              <li>Scholarships: {criteria?.financial?.scholarshipsAvailable ? 'Available' : 'Limited'}</li>
              {criteria?.financial?.notes && <li>{criteria.financial.notes}</li>}
            </ul>
          </div>
          <div className="card criteria-card">
            <h4>🛂 Visa Information</h4>
            <ul>
              <li>Processing Time: {criteria?.visa?.processingTimeWeeks?.min}-{criteria?.visa?.processingTimeWeeks?.max} weeks</li>
              <li>Work Allowed: {criteria?.visa?.workPermitWithStudy ? `Yes (${criteria.visa.maxWorkHoursPerWeek}h/week)` : 'No'}</li>
              <li>Health Insurance: {criteria?.visa?.healthInsuranceRequired ? 'Required' : 'Optional'}</li>
              {criteria?.visa?.notes && <li>{criteria.visa.notes}</li>}
            </ul>
          </div>
        </div>
      )}

      {tab === 'visa' && (
        <div className="animate-fade-in">
          <h3 className="mb-2">Step-by-Step Visa Process</h3>
          {guide?.visaProcess?.map((step) => (
            <div key={step.step} className="card guide-step">
              <div className="step-number">{step.step}</div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'documents' && (
        <div className="card animate-fade-in">
          <h3 className="mb-2">Required Documents</h3>
          <ul className="doc-list">
            {guide?.requiredDocuments?.map((doc, i) => (
              <li key={i}>📄 {doc}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'timeline' && (
        <div className="animate-fade-in">
          <h3 className="mb-2">Application Timeline</h3>
          <div className="timeline-grid stagger">
            {guide?.applicationTimeline?.map((item, i) => (
              <div key={i} className="card timeline-card">
                <div className="month">{item.month}</div>
                <div className="activity">{item.activity}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'links' && (
        <div className="card animate-fade-in">
          <h3 className="mb-2">Official Resources</h3>
          <ul className="doc-list">
            {guide?.officialLinks?.map((link, i) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  🔗 {link.title} &rarr;
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3">
        <Link to="/universities" className="btn btn-primary">
          Browse Universities in {country.name}
        </Link>
      </div>
    </div>
  );
}
