import { useNavigate } from 'react-router-dom';
import LandingHero from '../components/hero/LandingHero.jsx';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <LandingHero onStart={() => navigate('/main')} />
  );
}
