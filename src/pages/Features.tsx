import React from 'react';
import { motion } from 'framer-motion';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { Hero } from '../components/Hero';
import { InteractiveDemo } from '../components/InteractiveDemo';

export const FeaturesPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#050505]"
    >
      <div className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="container mx-auto px-6 text-center">
            <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-[0.4em] mb-4 block">CORE CAPABILITIES</span>
            <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tight italic mb-8">Precision. Power. Performance.</h1>
            <p className="text-lg text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
              Explore the advanced suite of tools designed for the next generation of digital artisans. From fashion to carpentry, we provide the ultimate drafting environment.
            </p>
          </div>
        </section>
        
        <FeaturesGrid />
        
        <section className="py-32 bg-black">
          <div className="container mx-auto px-6">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                  <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-[0.4em] mb-4 block">PHYSICS ENGINE</span>
                  <h2 className="text-5xl font-serif text-white italic mb-6">Cloth and Soft Body Dynamics</h2>
                  <p className="text-white/50 leading-relaxed mb-8">
                    Our proprietary simulation engine handles complex interactions between multiple layers of fabric, ensuring that every drape and fold is physically accurate.
                  </p>
                  <ul className="space-y-4">
                    {['Bespoke Stiffness Coefficients', 'Collision Detection Excellence', 'Real-time Shear Stress Analysis'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="aspect-square bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center p-12 glass overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <img 
                    src="https://images.unsplash.com/photo-1541178735423-47ce6430a9c1?q=80&w=1080" 
                    className="w-full h-full object-cover rounded-[2rem] opacity-50 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
                    alt="Physics Simulation"
                  />
                </div>
             </div>
          </div>
        </section>

        <InteractiveDemo />
      </div>
    </motion.div>
  );
};
