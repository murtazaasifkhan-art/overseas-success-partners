import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { countryAPI } from '../services/api';
import Loading from '../components/Loading';

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    countryAPI.list().then((res) => {
      setCountries(res.data.countries);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem' }}>Study Destinations in Europe</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
        Explore detailed information about studying in each country including eligibility 
        requirements, visa processes, and available universities.
      </p>

      <div className="grid grid-2">
        {countries.map((country) => (
          <Link to={`/countries/${country.code}`} key={country.code} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2.5rem' }}>{country.flagEmoji}</span>
                <div>
                  <h3>{country.name}</h3>
                  <span className="badge badge-info">{country.code}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
                {country.description}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                <span>Tuition: €{country.eligibilityCriteria?.financial?.averageTuitionMin?.toLocaleString()} - €{country.eligibilityCriteria?.financial?.averageTuitionMax?.toLocaleString()}/yr</span>
                <span>Living: ~€{country.eligibilityCriteria?.financial?.averageLivingCostPerYear?.toLocaleString()}/yr</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
