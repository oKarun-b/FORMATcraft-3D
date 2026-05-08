import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  onAuthClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onAuthClick }) => {
  return (
    <div className="min-h-screen bg-studio-dark selection:bg-gold/30 selection:text-white">
      <Navbar onAuthClick={onAuthClick} />
      <main>{children}</main>
      
      {/* Cinematic Backdrop */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.05)_0%,rgba(9,9,11,1)_100%)]" />
    </div>
  );
};
