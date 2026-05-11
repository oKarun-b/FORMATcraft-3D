import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase, isConfigured } from '../lib/supabase';

type AuthView = 'login' | 'signup' | 'forgot-password' | 'verify-email';

export const Auth = ({ onClose }: { onClose: () => void }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfigured) {
      // Mock Auth for Demo/Preview when Supabase is not configured
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onClose();
        console.log('Mock login successful');
      }, 1000);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else if (view === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        setView('verify-email');
      } else if (view === 'forgot-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        alert('Password reset link sent to your email.');
        setView('login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    if (!isConfigured) {
      // Mock Social Auth
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 1000);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0 }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[100] flex items-stretch bg-studio-dark"
    >
      {/* Visual Side (Left) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-transparent opacity-30" />
          
          {/* Elegant Floating Objects */}
          <motion.div 
            animate={{ 
              y: [0, -40, 0],
              rotateX: [0, 15, 0],
              rotateY: [0, 20, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-96 h-[600px] border border-gold/10 rounded-[4rem] flex items-center justify-center -rotate-12 backdrop-blur-[2px]"
          >
            <div className="w-full h-1/3 border-y border-gold/5" />
          </motion.div>

          <motion.div 
            animate={{ 
              y: [0, 50, 0],
              rotateX: [0, -10, 0],
              rotateZ: [0, 5, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full border-2 border-gold/5 flex items-center justify-center p-20"
          >
            <div className="w-full h-full rounded-full border border-gold/10 flex items-center justify-center p-12">
               <div className="w-full h-full rounded-full border border-gold/20" />
            </div>
          </motion.div>

          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        </div>

        <div className="relative z-10 p-24 flex flex-col justify-between w-full h-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center font-serif italic font-bold text-black text-xl">f</div>
            <span className="text-2xl font-serif text-white italic tracking-tighter">FormaCraft</span>
          </div>

          <div>
            <h1 className="text-6xl font-serif text-white tracking-tight italic mb-8 leading-tight">
              Reclaiming the <br/>Art of <span className="text-gold">Precision.</span>
            </h1>
            <p className="text-white/40 font-light text-lg leading-relaxed max-w-md">
              Join a global community of artisans merging computational power with traditional craft.
            </p>
          </div>

          <div className="flex gap-12 border-t border-white/5 pt-12">
            <div>
              <div className="text-white font-bold text-xl mb-1 tracking-tighter">12.4k+</div>
              <div className="text-[10px] text-white/20 uppercase tracking-widest">Active Artisans</div>
            </div>
            <div>
              <div className="text-white font-bold text-xl mb-1 tracking-tighter">85k+</div>
              <div className="text-[10px] text-white/20 uppercase tracking-widest">Models Forged</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-20 relative bg-[#080808]">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
        >
          <ChevronLeft size={24} className="inline mr-2" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Return to Gallery</span>
        </button>

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.div key="login" variants={formVariants} initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }}>
                <div className="mb-12">
                  <h2 className="text-4xl font-serif text-white italic tracking-tight mb-4">Welcome Back.</h2>
                  <p className="text-white/40 font-light">Enter your credentials to access your studio.</p>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-6 mb-10">
                  <AuthInput 
                    label="Email" 
                    type="email" 
                    icon={<Mail size={16} />} 
                    placeholder="name@atelier.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <AuthInput 
                    label="Password" 
                    type="password" 
                    icon={<Lock size={16} />} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    helper={<button type="button" onClick={() => setView('forgot-password')} className="text-gold/60 hover:text-gold transition-colors">Forgot?</button>}
                  />

                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-[10px] uppercase tracking-widest bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <button 
                    disabled={isLoading}
                    className="w-full py-5 rounded-full bg-gold text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Enter Studio <ArrowRight size={16} /></>}
                  </button>
                </form>

                <div className="relative mb-8 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <span className="relative px-4 bg-[#080808] text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Or continue with</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <SocialButton onClick={() => handleSocialAuth('google')} icon={<Chrome size={18} />} label="Google" />
                  <SocialButton onClick={() => handleSocialAuth('github')} icon={<Github size={18} />} label="Github" />
                </div>

                <button 
                  onClick={onClose}
                  className="w-full py-4 border border-gold/20 hover:border-gold/40 rounded-full text-[10px] font-mono text-gold/60 hover:text-gold uppercase tracking-[0.2em] transition-all mb-10"
                >
                  Continue in Offline Mode
                </button>

                <p className="text-center text-xs text-white/40 font-light">
                  New to the craft? <button onClick={() => setView('signup')} className="text-gold font-bold hover:underline">Create an account</button>
                </p>
              </motion.div>
            )}

            {view === 'signup' && (
              <motion.div key="signup" variants={formVariants} initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }}>
                <div className="mb-12">
                  <h2 className="text-4xl font-serif text-white italic tracking-tight mb-4">Begin Your Journey.</h2>
                  <p className="text-white/40 font-light">Join the vanguard of digital artisans.</p>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-6 mb-10">
                  <AuthInput 
                    label="Full Name" 
                    type="text" 
                    icon={<Mail size={16} />} 
                    placeholder="Julian Moretti" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <AuthInput 
                    label="Email Address" 
                    type="email" 
                    icon={<Mail size={16} />} 
                    placeholder="name@atelier.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <AuthInput 
                    label="Password" 
                    type="password" 
                    icon={<Lock size={16} />} 
                    placeholder="Create a strong password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-[10px] uppercase tracking-widest bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <button 
                    disabled={isLoading}
                    className="w-full py-5 rounded-full bg-gold text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Initialize Account <ArrowRight size={16} /></>}
                  </button>
                </form>

                <p className="text-center text-xs text-white/40 font-light">
                  Already a member? <button onClick={() => setView('login')} className="text-gold font-bold hover:underline">Sign in</button>
                </p>
              </motion.div>
            )}

            {view === 'forgot-password' && (
              <motion.div key="forgot" variants={formVariants} initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }}>
                <div className="mb-12">
                  <button onClick={() => setView('login')} className="mb-6 flex items-center gap-2 text-[10px] font-mono text-gold uppercase tracking-widest hover:text-white transition-colors">
                    <ChevronLeft size={14} /> Back to login
                  </button>
                  <h2 className="text-4xl font-serif text-white italic tracking-tight mb-4">Reset Password.</h2>
                  <p className="text-white/40 font-light">Enter your email and we'll send you recovery instructions.</p>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-6 mb-10">
                  <AuthInput 
                    label="Email" 
                    type="email" 
                    icon={<Mail size={16} />} 
                    placeholder="name@atelier.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-[10px] uppercase tracking-widest bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <button 
                    disabled={isLoading}
                    className="w-full py-5 rounded-full bg-gold text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Send Instructions <ArrowRight size={16} /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {view === 'verify-email' && (
              <motion.div key="verify" variants={formVariants} initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }} className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-10 border border-gold/20">
                  <CheckCircle2 size={32} className="text-gold" />
                </div>
                <h2 className="text-4xl font-serif text-white italic tracking-tight mb-6">Verification Sent.</h2>
                <p className="text-white/40 font-light leading-relaxed mb-10">
                  We've sent a secure link to your email. Please verify your account to unlock full studio capabilities.
                </p>
                <button 
                  onClick={() => setView('login')}
                  className="w-full py-5 rounded-full border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                  Continue to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const AuthInput = ({ label, type, icon, placeholder, helper, value, onChange }: { label: string, type: string, icon: React.ReactNode, placeholder: string, helper?: React.ReactNode, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">{label}</label>
      {helper && <span className="text-[10px] font-mono uppercase tracking-widest leading-none">{helper}</span>}
    </div>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
        {icon}
      </div>
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all focus:bg-white/[0.05]"
      />
    </div>
  </div>
);

const SocialButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    type="button"
    onClick={onClick}
    className="flex items-center justify-center gap-3 py-4 border border-white/5 bg-white/[0.02] rounded-2xl text-white/60 hover:text-white hover:bg-white/[0.05] hover:border-white/20 transition-all text-xs font-medium"
  >
    {icon}
    {label}
  </button>
);
