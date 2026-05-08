import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

export const Hero = ({ onEnterStudio }: { onEnterStudio: () => void }) => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* 3D Scene Container */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-60" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 mb-8 text-[11px] font-mono tracking-[0.3em] uppercase rounded-full border border-gold/30 bg-gold/5 text-gold">
            The Future of Craft
          </span>
          
          <h1 className="text-6xl md:text-9xl font-serif leading-[0.85] text-white tracking-tight mb-8 max-w-6xl mx-auto">
            Digital Atelier <br/>
            <span className="italic text-white/50">{t('hero.explore').split(' ')[0]} reimagined.</span>
          </h1>
          
          <p className="text-base md:text-lg text-white/40 max-w-xl mx-auto mb-12 leading-relaxed font-light">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              onClick={onEnterStudio}
              whileHover={{ scale: 1.05, backgroundColor: '#f59e0b' }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-colors"
            >
              Launch Workspace
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, borderColor: '#f59e0b' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-full border border-white/10 bg-white/5 text-white font-bold text-xs uppercase tracking-widest transition-all"
            >
              View Collections
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Aesthetic Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
      >
        <span className="text-[10px] font-bold tracking-widest uppercase text-white">Scroll</span>
        <ChevronDown size={16} className="text-gold" />
      </motion.div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};
