'use client';
import { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
} from 'three';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

// Render the room normally, then composite only the selection's outer border.
// No room pixels pass through another tone mapper or color conversion.
export function SilhouetteOutline({ targets }: { targets: Mesh[] }) {
  const { gl, scene, camera, size, invalidate } = useThree();
  const pipeline = useRef<{
    mask: WebGLRenderTarget;
    selection: Scene;
    copies: Mesh[];
    material: ShaderMaterial;
    quad: FullScreenQuad;
  } | null>(null);
  useLayoutEffect(() => {
    const mask = new WebGLRenderTarget(1, 1);
    const selection = new Scene();
    const white = new MeshBasicMaterial({
      color: 'white',
      side: DoubleSide,
      toneMapped: false,
    });
    const copies = targets.map((target) => {
      const copy = new Mesh(target.geometry, white);
      copy.matrixAutoUpdate = false;
      selection.add(copy);
      return copy;
    });
    const material = new ShaderMaterial({
      uniforms: {
        mask: { value: mask.texture },
        pixel: { value: new Vector2() },
      },
      vertexShader: `varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: `uniform sampler2D mask; uniform vec2 pixel; varying vec2 vUv;
        void main() {
          float center = texture2D(mask, vUv).r;
          float expanded = center;
          for (int i = 0; i < 16; i++) {
            float a = float(i) * 6.2831853 / 16.0;
            expanded = max(expanded, texture2D(mask, vUv + vec2(cos(a), sin(a)) * pixel).r);
          }
          gl_FragColor = vec4(1.0, 1.0, 1.0, expanded * (1.0 - center));
        }`,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const quad = new FullScreenQuad(material);
    pipeline.current = { mask, selection, copies, material, quad };
    invalidate();
    return () => {
      pipeline.current = null;
      mask.dispose();
      white.dispose();
      material.dispose();
      quad.dispose();
      invalidate();
    };
  }, [targets, invalidate]);
  useLayoutEffect(() => {
    const current = pipeline.current;
    if (!current) return;
    const dpr = gl.getPixelRatio();
    current.mask.setSize(
      Math.round(size.width * dpr),
      Math.round(size.height * dpr),
    );
    current.material.uniforms.pixel.value.set(2 / size.width, 2 / size.height);
    invalidate();
  }, [gl, size.width, size.height, targets, invalidate]);
  const clearColor = useRef(new Color());
  useFrame(() => {
    const current = pipeline.current;
    if (!current) {
      gl.render(scene, camera);
      return;
    }
    targets.forEach((target, index) => {
      target.updateWorldMatrix(true, false);
      current.copies[index].matrix.copy(target.matrixWorld);
    });
    const destination = gl.getRenderTarget();
    const autoClear = gl.autoClear;
    const clearAlpha = gl.getClearAlpha();
    gl.getClearColor(clearColor.current);
    gl.setRenderTarget(current.mask);
    gl.setClearColor(0x000000, 0);
    gl.autoClear = true;
    gl.render(current.selection, camera);
    gl.setRenderTarget(destination);
    gl.setClearColor(clearColor.current, clearAlpha);
    gl.render(scene, camera);
    gl.autoClear = false;
    current.quad.render(gl);
    gl.autoClear = autoClear;
  }, 1);
  return null;
}
