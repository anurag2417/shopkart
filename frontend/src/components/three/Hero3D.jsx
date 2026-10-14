import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';

const REDUCED =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const MOTION = REDUCED ? 0.15 : 1;

const COLORS = {
    core: '#7c5cff',
    cyan: '#22d3ee',
    coral: '#ff6b6b',
    shell: '#a5b4fc',
};

// A thin ring with small glowing nodes travelling along it
const Orbit = ({ radius, tilt, speed, color, nodes = 3 }) => {
    const group = useRef();

    useFrame((_, dt) => {
        if (group.current) group.current.rotation.y += dt * speed * MOTION;
    });

    return (
        <group rotation={tilt}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.006, 8, 160]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
            <group ref={group}>
                {Array.from({ length: nodes }, (_, i) => {
                    const a = (i / nodes) * Math.PI * 2;
                    return (
                        <mesh key={i} position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}>
                            <sphereGeometry args={[0.065, 16, 16]} />
                            <meshBasicMaterial color={color} toneMapped={false} />
                        </mesh>
                    );
                })}
            </group>
        </group>
    );
};

const Scene = ({ pointer }) => {
    const rig = useRef();
    const shell = useRef();

    useFrame((state, dt) => {
        const t = state.clock.elapsedTime * MOTION;

        // soft parallax that follows the cursor
        if (rig.current) {
            rig.current.rotation.y += (pointer.current.x * 0.45 - rig.current.rotation.y) * 0.05;
            rig.current.rotation.x += (-pointer.current.y * 0.3 - rig.current.rotation.x) * 0.05;
        }

        // the wireframe shell turns against the core
        if (shell.current) {
            shell.current.rotation.x = -t * 0.12;
            shell.current.rotation.y = -t * 0.18;
        }
    });

    return (
        <group ref={rig}>
            <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.9}>
                {/* liquid core */}
                <mesh scale={1.15}>
                    <icosahedronGeometry args={[1, 24]} />
                    <MeshDistortMaterial
                        color={COLORS.core}
                        distort={0.38}
                        speed={1.4 * MOTION}
                        roughness={0.12}
                        metalness={0.85}
                        emissive="#2a1a7a"
                        emissiveIntensity={0.45}
                    />
                </mesh>

                {/* wireframe shell */}
                <mesh ref={shell} scale={1.85}>
                    <icosahedronGeometry args={[1, 1]} />
                    <meshBasicMaterial color={COLORS.shell} wireframe transparent opacity={0.22} />
                </mesh>

                {/* orbits */}
                <Orbit
                    radius={2.35}
                    tilt={[0.35, 0, 0.2]}
                    speed={0.45}
                    color={COLORS.cyan}
                    nodes={3}
                />
                <Orbit
                    radius={2.9}
                    tilt={[-0.5, 0, -0.35]}
                    speed={-0.3}
                    color={COLORS.coral}
                    nodes={2}
                />
                <Orbit
                    radius={3.4}
                    tilt={[0.9, 0, 0.6]}
                    speed={0.2}
                    color={COLORS.shell}
                    nodes={4}
                />
            </Float>

            {/* drifting dust */}
            <Sparkles
                count={70}
                scale={[10, 6, 6]}
                size={2.2}
                speed={0.25 * MOTION}
                opacity={0.7}
                color="#c7d2fe"
            />
        </group>
    );
};

const Hero3D = ({ className = '' }) => {
    // Canvas sits behind content with pointer-events-none, so track the cursor on window
    const pointer = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e) => {
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, []);

    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`}>
            <Canvas
                dpr={[1, 1.75]}
                camera={{ position: [0, 0, 6.5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.35} />
                    <directionalLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
                    <pointLight position={[-5, -2, 2]} intensity={40} color={COLORS.cyan} />
                    <pointLight position={[5, -3, -2]} intensity={30} color={COLORS.coral} />
                    <Scene pointer={pointer} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Hero3D;
