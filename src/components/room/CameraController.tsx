'use client';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';
import { sceneSpec } from '@/lib/scene';
import { useNavigation } from '@/stores/navigation';
export function CameraController({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const { invalidate } = useThree();
  const view = useNavigation((s) => s.view);
  const target = useRef(new Vector3(...sceneSpec.camera_positions.home.target));
  const moving = useRef(true);
  useEffect(() => {
    moving.current = true;
    invalidate();
  }, [view, reducedMotion, invalidate]);
  useFrame(({ camera }, delta) => {
    if (!moving.current) return;
    const preset = sceneSpec.camera_positions[view];
    const position = new Vector3(...preset.position);
    const lookAt = new Vector3(...preset.target);
    const blend = reducedMotion ? 1 : 1 - Math.exp(-5 * Math.min(delta, 0.05));
    camera.up.set(0, 0, 1);
    camera.position.lerp(position, blend);
    target.current.lerp(lookAt, blend);
    camera.lookAt(target.current);
    const perspective = camera as PerspectiveCamera;
    perspective.fov += (preset.fov - perspective.fov) * blend;
    perspective.updateProjectionMatrix();
    if (
      camera.position.distanceTo(position) < 0.003 &&
      target.current.distanceTo(lookAt) < 0.003
    ) {
      camera.position.copy(position);
      camera.lookAt(lookAt);
      perspective.fov = preset.fov;
      perspective.updateProjectionMatrix();
      moving.current = false;
      useNavigation.setState({ transitioning: false });
    } else invalidate();
  });
  return null;
}
