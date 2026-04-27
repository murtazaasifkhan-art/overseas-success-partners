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
    <div className="animate-fade-in">
      <h2 className="mb-1">Study Destinations in Europe</h2>
      <p className="text-muted mb-3">
        Explore detailed information about studying in each country including eligibility
        requirements, visa processes, and available universities.
      </p>

      <div className="grid grid-2 stagger">
        {countries.map((country) => (
          <Link to={`/countries/${country.code}`} key={country.code} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card card-hover country-list-card">
              <img src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`} alt={country.name} className="flag-img-lg" />
              <div>
                <h3>{country.name}</h3>
                <p>{country.description}</p>
                <div className="meta">
                  <span>Tuition: &euro;{country.eligibilityCriteria?.financial?.averageTuitionMin?.toLocaleString()} - &euro;{country.eligibilityCriteria?.financial?.averageTuitionMax?.toLocaleString()}/yr</span>
                  <span>Living: ~&euro;{country.eligibilityCriteria?.financial?.averageLivingCostPerYear?.toLocaleString()}/yr</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
