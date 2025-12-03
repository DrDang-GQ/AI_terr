import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

// Materials
const leafMaterial = new THREE.MeshStandardMaterial({
  color: "#004225", // Deep Emerald
  roughness: 0.35,
  metalness: 0.2,
  flatShading: true,
});

const goldMaterial = new THREE.MeshStandardMaterial({
  color: "#ffd700",
  roughness: 0.1,
  metalness: 1.0,
  emissive: "#aa8800",
  emissiveIntensity: 0.3,
});

const ornamentColors = ["#d4af37", "#b8860b", "#ff4500", "#e5e4e2", "#ffffff"];

// --- Sub-components ---

interface LayerProps {
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
  index: number;
  isExploded: boolean;
}

const Layer: React.FC<LayerProps> = ({ scale, position: initialPos, rotation: initialRot, index, isExploded }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Store random rotation offset for explosion chaos
  const randomRot = useMemo(() => [
     (Math.random() - 0.5) * 0.2,
     (Math.random() - 0.5) * 0.5,
     (Math.random() - 0.5) * 0.2
  ], []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Explosion Logic:
    // Layers separate vertically significantly
    // They also rotate slightly off-axis to look like suspended parts
    
    const targetY = isExploded 
      ? initialPos[1] + (index * 1.2) + 1.5  // Spread out more
      : initialPos[1];

    const targetScale = isExploded ? scale * 0.95 : scale; 
    
    // Smooth spring-like interpolation
    const damp = 4;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * damp);
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * damp));
    
    // Rotation logic
    if (isExploded) {
       meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, initialRot[0] + randomRot[0], delta * 2);
       meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, initialRot[2] + randomRot[2], delta * 2);
       // Slow spin when exploded
       meshRef.current.rotation.y += delta * 0.1;
    } else {
       meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, initialRot[0], delta * 3);
       meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, initialRot[2], delta * 3);
       meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, initialRot[1], delta * 3);
    }
  });

  return (
    <mesh ref={meshRef} position={initialPos} rotation={initialRot} scale={scale} castShadow receiveShadow material={leafMaterial}>
      <coneGeometry args={[1.8, 2.5, 16]} /> 
    </mesh>
  );
};

interface BaubleData {
    position: [number, number, number];
    scale: number;
    color: string;
    vector: THREE.Vector3; // Direction vector from center
}

const BaubleItem: React.FC<{ data: BaubleData, isExploded: boolean }> = ({ data, isExploded }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const initialPos = new THREE.Vector3(...data.position);

    useFrame((state, delta) => {
        if(!meshRef.current) return;
        
        // Explosion Logic for Baubles:
        // They fly outwards radially from the tree center
        // And match the vertical expansion of the layers
        
        const explodeRadius = 3.5; // How far out they fly
        const verticalSpread = initialPos.y * 0.8; // Match layer spread roughly

        const targetPos = isExploded 
            ? initialPos.clone()
                .add(data.vector.clone().multiplyScalar(explodeRadius)) // Push out
                .add(new THREE.Vector3(0, verticalSpread + 1.0, 0))     // Push up
            : initialPos;

        meshRef.current.position.lerp(targetPos, delta * 3);
    });

    return (
         <mesh ref={meshRef} position={data.position} scale={data.scale} castShadow>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              color={data.color}
              roughness={0.1}
              metalness={0.95}
              envMapIntensity={2.0}
            />
         </mesh>
    );
}

const Baubles: React.FC<{ isExploded: boolean }> = ({ isExploded }) => {
  const count = 90;
  const baubles = useMemo(() => {
    const temp: BaubleData[] = [];
    for (let i = 0; i < count; i++) {
        const y = Math.random() * 7.5; 
        const radiusAtHeight = 1.9 * (1 - y / 8.0) + 0.3; 
        const theta = Math.random() * Math.PI * 2;
        
        const x = radiusAtHeight * Math.cos(theta);
        const z = radiusAtHeight * Math.sin(theta);
        const scale = Math.random() * 0.15 + 0.1;
        
        // Calculate outward vector for explosion (flat XZ plane vector)
        const vector = new THREE.Vector3(x, 0, z).normalize();
        
        temp.push({ 
            position: [x * 0.9, y - 0.5, z * 0.9], 
            scale, 
            color: ornamentColors[i % ornamentColors.length],
            vector
        });
    }
    return temp;
  }, []);

  return (
    <group>
      {baubles.map((data, i) => (
         <BaubleItem key={i} data={data} isExploded={isExploded} />
      ))}
    </group>
  );
};

const Tinsel: React.FC<{ isExploded: boolean }> = ({ isExploded }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    // A spiral curve
    const curve = useMemo(() => {
        const points = [];
        const loops = 8;
        const height = 8;
        const steps = 150;
        
        for(let i=0; i <= steps; i++) {
            const t = i / steps;
            const y = t * height;
            const r = 2.0 * (1 - t) + 0.1;
            const angle = t * Math.PI * 2 * loops;
            
            points.push(new THREE.Vector3(
                Math.cos(angle) * r,
                y - 0.5,
                Math.sin(angle) * r
            ));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    useFrame((state, delta) => {
        if(!meshRef.current) return;
        
        // When exploded, tinsel expands massively like a forcefield ring or disappears
        // Let's make it expand and fade
        const targetScale = isExploded ? 3.0 : 1;
        const targetOpacity = isExploded ? 0 : 1;
        
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2);
        
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        if(mat) {
             mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 4);
             mat.transparent = true;
        }
    });

    return (
        <mesh ref={meshRef} position={[0,0,0]}>
            <tubeGeometry args={[curve, 128, 0.04, 8, false]} />
            <meshStandardMaterial 
                color="#e5e4e2" 
                emissive="#ffffff"
                emissiveIntensity={0.6}
                metalness={1} 
                roughness={0.1} 
                transparent
            />
        </mesh>
    );
}

const Star: React.FC<{ isExploded: boolean }> = ({ isExploded }) => {
    const meshRef = useRef<THREE.Group>(null);
    
    useFrame((state, delta) => {
        if(meshRef.current) {
            // Spin logic
            meshRef.current.rotation.y += delta * 0.8;
            meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.15;
            
            // Explosion logic: Shoot up high
            const targetY = isExploded ? 14 : 7.8;
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 2.5);
            
            const targetScale = isExploded ? 1.8 : 1.0;
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2.5);
        }
    });

    return (
        <group ref={meshRef} position={[0, 7.8, 0]}>
            <mesh material={goldMaterial} scale={1.5}>
                <dodecahedronGeometry args={[0.4, 0]} />
            </mesh>
            <pointLight distance={8} intensity={20} color="#ffd700" />
            <Sparkles count={40} scale={3} size={15} speed={0.4} color="#fff" />
        </group>
    )
}

interface TreeProps {
    isExploded: boolean;
}

export const Tree: React.FC<TreeProps> = ({ isExploded }) => {
  // Config for layers
  const layers = [
    { y: 0.0, s: 1.6, r: 0 },
    { y: 1.0, s: 1.45, r: 0.5 },
    { y: 2.0, s: 1.3, r: 1.0 },
    { y: 3.0, s: 1.15, r: 1.5 },
    { y: 4.0, s: 1.0, r: 2.0 },
    { y: 5.0, s: 0.85, r: 2.5 },
    { y: 6.0, s: 0.7, r: 3.0 },
    { y: 7.0, s: 0.55, r: 3.5 },
  ];

  return (
    <group>
      {/* Tree Layers */}
      {layers.map((layer, index) => (
        <Layer 
          key={index} 
          index={index}
          position={[0, layer.y, 0]} 
          scale={layer.s} 
          rotation={[0, layer.r, 0]} 
          isExploded={isExploded}
        />
      ))}
      
      {/* Trunk - Stays put mostly, maybe sinks slightly */}
      <mesh position={[0, -0.5, 0]} castShadow>
         <cylinderGeometry args={[0.5, 0.8, 2, 8]} />
         <meshStandardMaterial color="#2d1c10" roughness={0.9} />
      </mesh>

      <Baubles isExploded={isExploded} />
      <Tinsel isExploded={isExploded} />
      <Star isExploded={isExploded} />
    </group>
  );
};