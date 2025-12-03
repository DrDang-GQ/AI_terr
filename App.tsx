import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { Loader } from '@react-three/drei';

export default function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [isExploded, setIsExploded] = useState(false);

  const toggleMusic = () => setIsMusicPlaying(!isMusicPlaying);
  const toggleSpeed = () => setRotationSpeed(prev => prev === 0.5 ? 2.0 : 0.5);
  const toggleExplode = () => setIsExploded(!isExploded);

  return (
    <div className="w-full h-screen relative bg-[#020403]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 11], fov: 45 }}
        gl={{ antialias: false, stencil: false, depth: true }}
      >
        <Suspense fallback={null}>
          <Scene rotationSpeed={rotationSpeed} isExploded={isExploded} />
        </Suspense>
      </Canvas>
      
      <UIOverlay 
        isMusicPlaying={isMusicPlaying} 
        toggleMusic={toggleMusic}
        rotationSpeed={rotationSpeed}
        toggleSpeed={toggleSpeed}
        isExploded={isExploded}
        toggleExplode={toggleExplode}
      />
      
      <Loader 
        containerStyles={{ background: '#020403' }} 
        innerStyles={{ width: '200px', background: '#333' }}
        barStyles={{ background: '#d4af37', height: '2px' }}
        dataStyles={{ color: '#d4af37', fontFamily: 'Cinzel' }}
      />
    </div>
  );
}