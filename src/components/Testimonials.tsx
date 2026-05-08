import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Julian Moretti',
    role: 'Creative Director, Atelier Luma',
    content: "The cloth simulation is frighteningly accurate. It's the first time I've trusted a digital drape enough to skip a physical prototype.",
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    rating: 5
  },
  {
    name: 'Elena Vance',
    role: 'Master Carpenter, Vance & Co.',
    content: "Calculating timber stress and grain alignment used to take days. Now the AI handles the structural integrity while I focus on the aesthetic joinery.",
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5
  },
  {
    name: 'Marcus Chen',
    role: 'Industrial Designer',
    content: "The ability to upload a custom texture and see it rendered with PBR accuracy in the browser is a total game changer for my client presentations.",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    rating: 4
  }
];

export const Testimonials = () => {
  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-[0.4em] mb-4 block">Endorsements</span>
          <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight italic">Voices from the Atelier.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] glass relative group"
            >
              <Quote size={40} className="absolute top-8 right-8 text-gold/10 group-hover:text-gold/20 transition-colors" />
              
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, starIndex) => (
                  <Star 
                    key={starIndex} 
                    size={12} 
                    className={`${starIndex < t.rating ? 'text-gold fill-gold' : 'text-white/10'}`} 
                  />
                ))}
              </div>

              <p className="text-lg text-white/70 font-light leading-relaxed mb-10 italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full border border-gold/30 grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div>
                  <div className="text-sm font-bold text-white tracking-wide">{t.name}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Light */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full h-40 bg-gold/5 blur-[120px] rounded-full" />
    </section>
  );
};
