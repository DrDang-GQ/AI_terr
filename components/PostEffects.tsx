import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const PostEffects: React.FC = () => {
  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        luminanceThreshold={0.75} 
        mipmapBlur 
        intensity={1.8} 
        radius={0.5}
      />
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.05} darkness={0.8} /> 
      {/* Reduced vignette darkness for brighter corners */}
      
      <ToneMapping
        adaptive={true} 
        resolution={256} 
        middleGrey={0.7} // Increased middle grey for brighter exposure
        maxLuminance={16.0} 
        averageLuminance={1.0} 
        adaptationRate={1.0} 
      />
    </EffectComposer>
  );
};