import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function HouseModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const roofGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Pentagon cross-section for roof
    shape.moveTo(-1.2, 0);
    shape.lineTo(1.2, 0);
    shape.lineTo(1.2, 0.1);
    shape.lineTo(0, 0.9);
    shape.lineTo(-1.2, 0.1);
    shape.closePath();

    const extrudeSettings = {
      depth: 1.6,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }, []);

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("hsl(210, 80%, 70%)"),
        transmission: 0.92,
        roughness: 0.05,
        metalness: 0.0,
        ior: 1.45,
        thickness: 0.5,
        transparent: true,
        opacity: 0.9,
        envMapIntensity: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      }),
    []
  );

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.6}>
      <group ref={groupRef} scale={1.3}>
        {/* Base / walls */}
        <mesh position={[0, -0.2, 0]} material={glassMaterial}>
          <boxGeometry args={[2, 1.4, 1.6]} />
        </mesh>

        {/* Roof */}
        <mesh
          position={[0, 0.5, 0]}
          geometry={roofGeometry}
          material={glassMaterial}
        />

        {/* Door */}
        <mesh position={[0, -0.55, 0.81]} material={glassMaterial}>
          <boxGeometry args={[0.5, 0.7, 0.05]} />
        </mesh>

        {/* Window left */}
        <mesh position={[-0.55, -0.05, 0.81]} material={glassMaterial}>
          <boxGeometry args={[0.4, 0.4, 0.05]} />
        </mesh>

        {/* Window right */}
        <mesh position={[0.55, -0.05, 0.81]} material={glassMaterial}>
          <boxGeometry args={[0.4, 0.4, 0.05]} />
        </mesh>

        {/* Chimney */}
        <mesh position={[0.6, 1.0, -0.2]} material={glassMaterial}>
          <boxGeometry args={[0.25, 0.6, 0.25]} />
        </mesh>
      </group>
    </Float>
  );
}

export function CrystalHouse() {
  return (
    <div className="w-full h-[250px] md:h-[350px] lg:h-[400px]">
      <Canvas
        camera={{ position: [3, 2, 4], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />
        <Environment preset="city" />
        <HouseModel />
      </Canvas>
    </div>
  );
}
