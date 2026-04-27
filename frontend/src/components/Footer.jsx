import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { siteConfig } = useTheme();
  const appName = siteConfig?.branding?.appName || 'Overseas Success Partners';

  return (
    <footer className="footer">
      &copy; {new Date().getFullYear()} Overseas Success Partners - Global Consultancy Services. Helping students achieve their study abroad dreams.
    </footer>
  );
}
