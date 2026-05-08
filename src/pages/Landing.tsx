import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero onEnterStudio={() => navigate('/studio')} />
      
      <div id="features">
        <FeaturesGrid />
      </div>

      <InteractiveDemo />

      <Testimonials />

      <Footer />
    </motion.div>
  );
};
