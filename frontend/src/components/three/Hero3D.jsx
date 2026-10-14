import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

const FloatingObject = () => {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    });

    return (
        <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
            <mesh ref={meshRef} scale={1.4}>
                <icosahedronGeometry args={[1, 3]} />
                <meshStandardMaterial
                    color="#3b82f6"
                    roughness={0.25}
                    metalness={0.65}
                    flatShading
                />
            </mesh>
        </Float>
    );
};

const Hero3D = () => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <Canvas
                dpr={[1, 1.75]}
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[4, 4, 4]} intensity={1.1} color="#ffffff" />
                    <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#93c5fd" />
                    <FloatingObject />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Hero3D;
