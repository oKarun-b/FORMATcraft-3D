import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from './pages/Landing';
import { FeaturesPage } from './pages/Features';
import { PricingPage } from './pages/Pricing';
import { StudioPage } from './pages/Studio';
import { MarketplacePage } from './pages/Marketplace';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const location = useLocation();

  return (
    <Layout onAuthClick={() => setShowAuth(true)}>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        {showAuth && <Auth onClose={() => setShowAuth(false)} />}
        
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/workspace" element={<StudioPage />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
