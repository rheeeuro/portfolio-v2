'use client';
import { Component, Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace } from 'three';
import { sceneSpec, tuple } from '@/lib/scene';
import { useNavigation } from '@/stores/navigation';
import { CameraController } from './CameraController';
import { EnvironmentController } from './EnvironmentController';
import { RoomModel } from './RoomModel';
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    useNavigation.setState({ failed: true });
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function RoomScene({
  reducedMotion,
  visible,
}: {
  reducedMotion: boolean;
  visible: boolean;
}) {
  const home = sceneSpec.camera_positions.home;
  return (
    <SceneBoundary>
      <Canvas
        shadows
        frameloop={visible ? 'demand' : 'never'}
        dpr={[1, 1.5]}
        camera={{
          position: tuple(home.position),
          up: [0, 0, 1],
          fov: home.fov,
          near: 0.05,
          far: 30,
        }}
        gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }}
        fallback={
          <p>
            3D를 지원하지 않는 브라우저입니다. 메뉴에서 콘텐츠를 확인해 주세요.
          </p>
        }
        onCreated={({ gl, camera }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = sceneSpec.render_notes.recommended_exposure;
          gl.outputColorSpace = SRGBColorSpace;
          gl.shadowMap.type = PCFShadowMap;
          camera.up.set(0, 0, 1);
          camera.lookAt(...tuple(home.target));
          gl.domElement.addEventListener('webglcontextlost', () =>
            useNavigation.setState({ failed: true }),
          );
        }}
      >
        <CameraController reducedMotion={reducedMotion} />
        <EnvironmentController />
        <Suspense fallback={null}>
          <RoomModel />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}
