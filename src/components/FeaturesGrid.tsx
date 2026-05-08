import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Cpu, 
  Scissors, 
  Box, 
  Upload, 
  Monitor, 
  Users, 
  Download, 
  Cloud 
} from 'lucide-react';

interface Feature {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: 'Real-time 3D Rendering',
    desc: 'High-fidelity WebGL engine with realistic PBR lighting and soft shadows.',
    icon: <Zap size={24} />,
  },
  {
    title: 'AI-Assisted Generation',
    desc: 'Intelligent pattern optimization and body-scan mesh reconstruction.',
    icon: <Cpu size={24} />,
  },
  {
    title: 'Fabric Simulation',
    desc: 'Bespoke physics for silk, denim, and heavy wool drape visualization.',
    icon: <Scissors size={24} />,
  },
  {
    title: 'Wood Material System',
    desc: 'Procedural timber grain for Oak, Cherry, and rare exotic hard woods.',
    icon: <Box size={24} />,
  },
  {
    title: 'Texture Uploads',
    desc: 'Convert any image to a high-resolution PBR material in seconds.',
    icon: <Upload size={24} />,
  },
  {
    title: 'Browser Editor',
    desc: 'Desktop-grade CAD performance directly inside Chrome and Safari.',
    icon: <Monitor size={24} />,
  },
  {
    title: 'Team Collaboration',
    desc: 'Real-time multi-user studio sessions with version-controlled changes.',
    icon: <Users size={24} />,
  },
  {
    title: 'High-End Export',
    desc: 'Production-ready STL, OBJ, and GLTF files with optimized hierarchy.',
    icon: <Download size={24} />,
  },
  {
    title: 'Cloud Saves',
    desc: 'Enterprise-grade encryption for your most valuable designs and patterns.',
    icon: <Cloud size={24} />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const FeaturesGrid = () => {
  return (
    <section className="py-32 bg-studio-dark relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-[0.4em] mb-4 block">Capacities</span>
          <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight italic">Engineered for Excellence.</h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ scale: 1.02, borderColor: 'rgba(245, 158, 11, 0.3)' }}
              className="p-10 rounded-[2rem] border border-white/5 bg-white/[0.02] glass group transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold mb-8 group-hover:bg-gold/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-white mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-light">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
    </section>
  );
};
