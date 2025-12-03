import React from 'react';
import { motion } from 'framer-motion';
import { Music, RotateCw, Wind, Zap, Box } from 'lucide-react';

interface UIOverlayProps {
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  rotationSpeed: number;
  toggleSpeed: () => void;
  isExploded: boolean;
  toggleExplode: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ 
  isMusicPlaying, 
  toggleMusic, 
  rotationSpeed,
  toggleSpeed,
  isExploded,
  toggleExplode
}) => {
  return (
    <>
      {/* Top Left Branding */}
      <div className="absolute top-0 left-0 p-8 z-10 select-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h2 className="text-[#d4af37] tracking-[0.3em] text-xs font-bold uppercase mb-2 font-['Cinzel']">
            The Arix Collection
          </h2>
          <h1 className="text-white text-5xl md:text-6xl font-['Playfair_Display'] italic leading-tight">
            Signature <br />
            <span className="text-[#0e4d3a] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Christmas</span>
          </h1>
        </motion.div>
      </div>

      {/* Bottom Right Controls */}
      <div className="absolute bottom-0 right-0 p-8 z-10 flex flex-col items-end gap-6">
        <ControlGroup 
          label={isExploded ? "Assemble" : "Explode"} 
          active={isExploded} 
          onClick={toggleExplode}
          icon={isExploded ? <Box size={20} /> : <Zap size={20} />}
        />
        <ControlGroup 
          label="Ambience" 
          active={isMusicPlaying} 
          onClick={toggleMusic}
          icon={<Music size={20} />}
        />
        <ControlGroup 
          label={rotationSpeed > 0.5 ? "Fast Rotate" : "Slow Rotate"} 
          active={rotationSpeed > 0.5} 
          onClick={toggleSpeed}
          icon={<Wind size={20} />}
        />
      </div>

      {/* Decorative Border Frame */}
      <div className="absolute inset-0 border-[1px] border-[#d4af37] opacity-20 pointer-events-none m-4" />
      <div className="absolute inset-0 border-[1px] border-[#d4af37] opacity-10 pointer-events-none m-6" />

      {/* Vignette Overlay (HTML based for grain texture if needed, but using PP currently) */}
    </>
  );
};

const ControlGroup = ({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`group flex items-center gap-4 transition-all duration-500`}
  >
    <span className={`uppercase tracking-widest text-xs font-['Cinzel'] transition-colors duration-300 ${active ? 'text-[#d4af37]' : 'text-gray-500'}`}>
      {label}
    </span>
    <div className={`
      w-12 h-12 rounded-full border border-[#d4af37] flex items-center justify-center
      transition-all duration-300 backdrop-blur-sm
      ${active ? 'bg-[#d4af37] text-black shadow-[0_0_15px_#d4af37]' : 'bg-black/30 text-[#d4af37] hover:bg-[#d4af37]/10'}
    `}>
      {icon}
    </div>
  </motion.button>
);