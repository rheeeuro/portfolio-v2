'use client';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3, MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { sceneSpec } from '@/lib/scene';
import { useNavigation } from '@/stores/navigation';
export function CameraController({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const { invalidate, gl, scene, size } = useThree();
  const ready = useNavigation((s) => s.ready);
  const pointerOffset = useRef({ x: 0, y: 0 });
  const view = useNavigation((s) => s.view);
  const target = useRef(new Vector3(...sceneSpec.camera_positions.home.target));
  const moving = useRef(true);
  useEffect(() => {
    moving.current = true;
    invalidate();
  }, [view, reducedMotion, ready, size.width, size.height, invalidate]);
  useEffect(() => {
    const canvas = gl.domElement;
    const move = (event: PointerEvent) => {
      if (reducedMotion || view !== 'home' || event.pointerType !== 'mouse')
        return;
      const bounds = canvas.getBoundingClientRect();
      pointerOffset.current = {
        x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.12,
        y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.06,
      };
      moving.current = true;
      invalidate();
    };
    const reset = () => {
      pointerOffset.current = { x: 0, y: 0 };
      moving.current = true;
      invalidate();
    };
    reset();
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', reset);
    return () => {
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', reset);
    };
  }, [gl, invalidate, reducedMotion, view]);
  useFrame(({ camera }, delta) => {
    if (!moving.current) return;
    const preset = sceneSpec.camera_positions[view];
    const position = new Vector3(...preset.position);
    const lookAt = new Vector3(...preset.target);
    if (view === 'home' && !reducedMotion) {
      position.x += pointerOffset.current.x;
      position.z -= pointerOffset.current.y;
    }
    const blend = reducedMotion ? 1 : 1 - Math.exp(-5 * Math.min(delta, 0.05));
    camera.up.set(0, 0, 1);
    camera.position.lerp(position, blend);
    target.current.lerp(lookAt, blend);
    camera.lookAt(target.current);
    const perspective = camera as PerspectiveCamera;
    let targetFov = preset.fov;
    if (view === 'home') {
      const lightSwitch = scene.getObjectByName(
        sceneSpec.interaction_contract.Theme,
      );
      if (lightSwitch) {
        // The mobile canvas extends beyond the viewport. Fit the actual visible area.
        const bounds = gl.domElement.getBoundingClientRect();
        const rightEdge = Math.min(bounds.right, window.innerWidth) - 28;
        const rightNdc = ((rightEdge - bounds.left) / bounds.width) * 2 - 1;
        const probe = perspective.clone();
        probe.position.copy(position);
        probe.lookAt(lookAt);
        probe.fov = preset.fov;
        probe.updateProjectionMatrix();
        probe.updateMatrixWorld();
        const switchPoint = new Box3()
          .setFromObject(lightSwitch)
          .getCenter(new Vector3())
          .project(probe);
        if (rightNdc > 0 && switchPoint.x > rightNdc) {
          targetFov = MathUtils.radToDeg(
            2 *
              Math.atan(
                (Math.tan(MathUtils.degToRad(preset.fov / 2)) * switchPoint.x) /
                  rightNdc,
              ),
          );
        }
      }
    }
    perspective.fov += (targetFov - perspective.fov) * blend;
    perspective.updateProjectionMatrix();
    if (
      camera.position.distanceTo(position) < 0.003 &&
      target.current.distanceTo(lookAt) < 0.003
    ) {
      camera.position.copy(position);
      camera.lookAt(lookAt);
      perspective.fov = targetFov;
      perspective.updateProjectionMatrix();
      moving.current = false;
      useNavigation.setState({ transitioning: false });
    } else invalidate();
  });
  return null;
}
