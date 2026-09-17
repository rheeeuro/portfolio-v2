'use client';
import { useEnvironment } from '@/stores/environment';
export const skyColors = {
  dawn: '#b992a3',
  day: '#8fbfd1',
  sunset: '#b98168',
  night: '#26374d',
};
export function EnvironmentController() {
  const { theme, phase, weather } = useEnvironment();
  const bright = theme === 'light';
  const daylight = phase === 'day' || phase === 'dawn';
  return (
    <>
      <color attach="background" args={[bright ? '#bdb9aa' : '#222720']} />
      <ambientLight intensity={bright ? 1.1 : 0.45} color="#ffe3c2" />
      <hemisphereLight
        args={[skyColors[phase], '#8c6b49', daylight ? 1.5 : 0.55]}
        position={[0, 0, 3]}
      />
      <directionalLight
        position={[0.4, -1, 3.6]}
        intensity={weather === 'rain' ? 1 : daylight ? 2.3 : 0.8}
        color={skyColors[phase]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-normalBias={0.025}
      />
      <pointLight
        position={[-0.62, 0.35, 1.19]}
        intensity={bright ? 6 : 3.4}
        distance={3.5}
        decay={2}
        color="#ffc17a"
      />
      <pointLight
        position={[0.08, 0.54, 1.18]}
        intensity={bright ? 0.5 : 1.3}
        distance={1.5}
        color="#a4c8e8"
      />
      <pointLight
        position={[0.28, 1.5, 1.9]}
        intensity={daylight ? 3 : 0.7}
        distance={4}
        color={skyColors[phase]}
      />
    </>
  );
}
