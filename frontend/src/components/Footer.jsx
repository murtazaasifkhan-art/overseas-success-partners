import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { siteConfig } = useTheme();
  const appName = siteConfig?.branding?.appName || 'Overseas Success Partners';

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/globe-logo.svg" alt="Globe" className="footer-globe" />
          <div>
            <strong>OVERSEAS SUCCESS PARTNERS</strong>
            <span className="footer-tagline">GLOBAL CONSULTANCY SERVICES</span>
          </div>
        </div>
        <div className="footer-contact">
          <a href="mailto:overseassuccesspartners@gmail.com">📧 overseassuccesspartners@gmail.com</a>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Overseas Success Partners - Global Consultancy Services. Helping students achieve their study abroad dreams.
        </div>
      </div>
    </footer>
  );
}
