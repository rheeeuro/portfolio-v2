'use client';
import { useMemo } from 'react';
import { Object3D } from 'three';
import { useEnvironment } from '@/stores/environment';
export const skyColors = {
  dawn: '#b992a3',
  day: '#8fbfd1',
  sunset: '#b98168',
  night: '#26374d',
};
export function EnvironmentController() {
  const { theme, phase, weather } = useEnvironment();
  const lampTarget = useMemo(() => {
    const target = new Object3D();
    target.position.set(-0.42, 0.44, 0.74);
    return target;
  }, []);
  const bright = theme === 'light';
  const daylight = phase === 'day' || phase === 'dawn';
  return (
    <>
      <color attach="background" args={[bright ? '#bdb9aa' : '#222720']} />
      <ambientLight intensity={bright ? 0.65 : 0.28} color="#ffe3c2" />
      <hemisphereLight
        args={[skyColors[phase], '#8c6b49', daylight ? 1.1 : 0.5]}
        position={[0, 0, 3]}
      />
      <directionalLight
        position={[0.3, 1.2, 3.2]}
        intensity={(daylight ? 1.8 : 0.65) * (weather === 'rain' ? 0.65 : 1)}
        color={skyColors[phase]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-intensity={0.55}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-normalBias={0.012}
        shadow-bias={-0.0002}
      />
      <primitive object={lampTarget} />
      <spotLight
        position={[-0.44, 0.77, 1.12]}
        target={lampTarget}
        intensity={bright ? 2.2 : 1.35}
        angle={0.95}
        penumbra={1}
        distance={2}
        decay={2}
        color="#ffd09a"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-normalBias={0.008}
        shadow-bias={-0.0002}
      />
      <pointLight
        position={[-0.44, 0.72, 1.15]}
        intensity={bright ? 0.65 : 0.4}
        distance={1.4}
        decay={2}
        color="#ffc17a"
      />
      <pointLight
        position={[0.08, 0.54, 1.18]}
        intensity={bright ? 0.18 : 0.4}
        distance={1.5}
        color="#a4c8e8"
      />
      <pointLight
        position={[0.28, 1.5, 1.9]}
        intensity={daylight ? 1.4 : 0.45}
        distance={4}
        color={skyColors[phase]}
      />
    </>
  );
}
