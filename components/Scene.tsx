import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Sparkles, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Tree } from './Tree';
import { PostEffects } from './PostEffects';

interface SceneProps {
  rotationSpeed: number;
  isExploded: boolean;
}

export const Scene: React.FC<SceneProps> = ({ rotationSpeed, isExploded }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slow down rotation when exploded to let user inspect parts
      const targetSpeed = isExploded ? rotationSpeed * 0.2 : rotationSpeed;
      groupRef.current.rotation.y += delta * 0.1 * targetSpeed;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={50} />
      
      {/* Cinematic Lighting - Brightness Boosted */}
      <ambientLight intensity={0.8} color="#002a20" />
      <spotLight 
        position={[5, 12, 8]} 
        angle={0.3} 
        penumbra={0.5} 
        intensity={600} 
        color="#fff5db" 
        castShadow 
        shadow-bias={-0.0001}
      />
      {/* Fill lights */}
      <pointLight position={[-6, 6, -6]} intensity={150} color="#00ff99" distance={25} />
      <pointLight position={[6, 4, 6]} intensity={100} color="#ffcc00" distance={20} />
      <pointLight position={[0, 2, 5]} intensity={50} color="#ffffff" distance={10} />

      {/* Environment for Reflections - Increased Intensity */}
      <Environment preset="city" environmentIntensity={1.5} />

      <group ref={groupRef} position={[0, -3.0, 0]}>
        <Tree isExploded={isExploded} />
        
        {/* Floating Ambient Particles */}
        <Sparkles 
          count={200} 
          scale={12} 
          size={5} 
          speed={0.4} 
          opacity={0.8} 
          color="#ffd700" 
        />
      </group>

      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
         <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Float>

      {/* Floor Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#010805"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 1.8}
        maxDistance={25}
        minDistance={5}
        autoRotate={false}
      />

      <PostEffects />
    </>
  );
};