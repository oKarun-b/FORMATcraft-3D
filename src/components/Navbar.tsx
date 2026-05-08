import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = ({ onAuthClick }: { onAuthClick: () => void }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  const isStudio = location.pathname === '/studio' || location.pathname === '/workspace';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 border-b border-white/5 backdrop-blur-2xl transition-all duration-700 ${isStudio ? 'h-14 bg-black/80' : 'h-20 bg-studio-dark/40'}`}>
      <Link to="/">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-4 h-4 bg-gold rounded-[1px] flex items-center justify-center font-bold text-black text-[8px] italic">F</div>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white">FormaCraft <span className="text-gold/60">3D</span></span>
        </motion.div>
      </Link>

      <div className="hidden md:flex items-center gap-12 text-[8px] font-bold text-white/20 uppercase tracking-[0.4em]">
        <NavLink to="/features">{t('nav.features')}</NavLink>
        <NavLink to="/studio">{t('nav.studio')}</NavLink>
        <NavLink to="/marketplace">MARKET</NavLink>
        <NavLink to="/studio">NODE</NavLink>
        <NavLink to="/pricing">{t('nav.pricing')}</NavLink>
      </div>

      <div className="flex items-center gap-6">
        {isStudio && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 text-[7px] font-mono tracking-[0.2em]">
            <span className="w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse"></span>
            <span className="opacity-30 text-white uppercase">UPLINK_STABLE</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="text-[8px] font-mono text-white/10 hover:text-gold transition-colors uppercase px-3 border-r border-white/5 tracking-widest font-bold"
          >
            {i18n.language === 'en' ? 'INT_01' : 'INT_02'}
          </button>
          
          <motion.button
            onClick={onAuthClick}
            className="px-4 py-1.5 text-[8px] font-black rounded-sm bg-white text-black transition-all uppercase tracking-[0.3em] hover:bg-gold active:scale-95 shadow-xl shadow-white/5"
          >
            {t('nav.getStarted')}
          </motion.button>
          
          <button className="md:hidden text-white/40">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link 
    to={to} 
    className="hover:text-white transition-colors relative group py-2"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
  </Link>
);
