import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Globe, Zap, Shield, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#050505] min-h-screen pt-32 pb-20"
    >
      <div className="container mx-auto px-6 text-center mb-24">
        <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-[0.4em] mb-4 block">INVESTMENT</span>
        <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tight italic mb-8">Transparent Value.</h1>
        <p className="text-lg text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
          Choose the plan that suits your creative scale. No hidden fees, just pure professional power delivered to your browser.
        </p>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <PricingCard 
          index={0}
          tier="Starter"
          price="Free"
          desc="For individual creators exploring digital drafting."
          features={["3 Basic 3D Models", "2D Pattern Export (PDF)", "Standard Materials", "Community Support"]}
        />
        <PricingCard 
          index={1}
          tier="Pro"
          price="$49/mo"
          featured
          desc="Professional toolset for independent boutiques."
          features={["Unlimited Projects", "AI Design Assistant", "Cloud Storage (50GB)", "High-Res Rendering", "Priority Support"]}
        />
        <PricingCard 
          index={2}
          tier="Studio"
          price="Custom"
          to="/studio"
          desc="Scalable solutions for fashion houses & brands."
          features={["Custom CAD Integration", "Team Collaboration", "API Access", "SSO/SAML", "Designated Support Engineer"]}
        />
      </div>

      {/* Comparison Table / Key Features */}
      <section className="container mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <FeatureBadge 
            icon={<Shield className="text-gold" />}
            title="Enterprise Security"
            desc="Your intellectual property is protected with end-to-end encryption and ISO certified infrastructure."
          />
          <FeatureBadge 
            icon={<Globe className="text-gold" />}
            title="Global Collaboration"
            desc="Seamlessly work with vendors and craftsmen across continents with real-time multi-user editing."
          />
          <FeatureBadge 
            icon={<Headphones className="text-gold" />}
            title="Elite Support"
            desc="Our engineers are available 24/7 to help you optimize your digital production workflows."
          />
        </div>
      </section>

      <div className="mt-32 text-center">
        <h2 className="text-3xl font-serif text-white italic mb-6">Need a custom enterprise solution?</h2>
        <button className="px-10 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gold transition-colors">
          Talk to our team
        </button>
      </div>
    </motion.div>
  );
};

const PricingCard = ({ tier, price, desc, features, featured = false, index, to }: { tier: string, price: string, desc: string, features: string[], featured?: boolean, index: number, to?: string }) => {
  const CardButton = () => (
    <button 
      className={`w-full py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${featured ? 'bg-gold text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
    >
      Choose {tier}
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className={`p-12 rounded-[2rem] border flex flex-col h-full transition-all duration-500 ${featured ? 'border-amber-500/30 bg-amber-500/10 scale-105 glass z-10' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
    >
      <div className="mb-10">
        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-4 block ${featured ? 'text-gold' : 'text-white/40'}`}>{tier}</span>
        <div className="text-5xl font-serif italic text-white mb-6 tracking-tighter">{price}</div>
        <p className="text-xs text-white/40 leading-relaxed font-light">{desc}</p>
      </div>
      
      <div className="space-y-5 mb-12 flex-1">
        {features.map((f, i) => (
          <div key={i} className="flex gap-4 items-center text-xs text-white/50 tracking-wide font-light">
            <div className="w-4 h-4 rounded-full bg-gold/10 flex items-center justify-center">
              <Check size={10} className="text-gold" />
            </div>
            {f}
          </div>
        ))}
      </div>
      
      <div className="pt-8 border-t border-white/5">
        {to ? (
          <Link to={to}>
            <CardButton />
          </Link>
        ) : (
          <CardButton />
        )}
      </div>
    </motion.div>
  );
};

const FeatureBadge = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all duration-300">
    <div className="mb-6">{icon}</div>
    <h3 className="text-white font-medium mb-3 tracking-tight">{title}</h3>
    <p className="text-xs text-white/40 leading-relaxed font-light">{desc}</p>
  </div>
);
