import React from 'react';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Github, 
  ArrowRight,
  Globe,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  return (
    <footer className="bg-[#050505] pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center font-serif italic font-bold text-black">f</div>
              <span className="text-xl font-serif text-white italic tracking-tighter">FormaCraft</span>
            </div>
            <p className="text-white/40 font-light leading-relaxed mb-10 max-w-sm">
              The digital atelier for modern artisans. Subscribe to our journal for the latest in computational craft and design theory.
            </p>
            
            <div className="relative max-w-md">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS"
                className="w-full bg-white/[0.03] border border-white/10 rounded-full py-5 px-8 text-xs font-mono text-white tracking-[0.2em] focus:outline-none focus:border-gold/50 transition-colors"
              />
              <button className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-gold text-black flex items-center justify-center hover:bg-gold-light transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-mono font-bold text-gold uppercase tracking-[0.4em] mb-10">Exploration</h4>
            <ul className="space-y-6">
              {[
                { label: 'Atelier', to: '/' },
                { label: 'Features', to: '/features' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'Marketplace', to: '/marketplace' },
                { label: 'Studio', to: '/studio' },
                { label: 'Workspace', to: '/workspace' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-white/40 hover:text-white transition-colors text-sm font-light tracking-wide">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Language */}
          <div>
            <h4 className="text-[10px] font-mono font-bold text-gold uppercase tracking-[0.4em] mb-10">Connections</h4>
            <div className="flex gap-6 mb-12">
              <SocialLink icon={<Instagram size={18} />} />
              <SocialLink icon={<Twitter size={18} />} />
              <SocialLink icon={<Linkedin size={18} />} />
              <SocialLink icon={<Github size={18} />} />
            </div>

            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-white/60 uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              <Globe size={14} />
              {i18n.language === 'en' ? 'English (US)' : 'Français (FR)'}
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
          <div>&copy; 2026 FormaCraft Studios &bull; Designed in Lyon</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[140px] pointer-events-none translate-x-1/3 translate-y-1/3" />
    </footer>
  );
};

const SocialLink = ({ icon }: { icon: React.ReactNode }) => (
  <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-gold hover:text-gold transition-all duration-300">
    {icon}
  </a>
);
