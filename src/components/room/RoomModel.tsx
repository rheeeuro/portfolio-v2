'use client';
import { useEffect, useMemo, useRef } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import {
  Box3,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  TextureLoader,
  SRGBColorSpace,
  ShaderMaterial,
} from 'three';
import { screenGeometry, refineMaterial } from './materials';
import { projects } from '@/content/projects';
import { sceneSpec, sceneUrl, type View } from '@/lib/scene';
import { useNavigation } from '@/stores/navigation';
import { useEnvironment } from '@/stores/environment';
import { toggleAudio } from '@/stores/audio';
import { createWindowLandscape, landscapePalettes } from './windowLandscape';
import styles from '../Workspace.module.css';

const contract = sceneSpec.interaction_contract;
function action(name: string): (() => void) | undefined {
  const navigate = (view: View) => () =>
    useNavigation.getState().navigate(view);
  if (name === contract.Projects) return navigate('projects');
  if (contract.About.includes(name)) return navigate('about');
  if (name === contract.Theme) return useEnvironment.getState().toggleTheme;
  if (name === contract.Environment) return navigate('window');
  if (
    contract.Sound.includes(name) ||
    name.startsWith('speakerL_') ||
    name.startsWith('speakerR_')
  )
    return () => void toggleAudio();
}
function Hotspot({
  position,
  label,
  detail,
  onClick,
}: {
  position: Vector3;
  label: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <Html position={position} center zIndexRange={[20, 10]}>
      <button className={styles.hotspot} onClick={onClick} aria-label={detail}>
        <span />
        {label}
        <small>↗</small>
      </button>
    </Html>
  );
}
export function RoomModel({
  reducedMotion,
  visible,
}: {
  reducedMotion: boolean;
  visible: boolean;
}) {
  const { scene } = useGLTF(sceneUrl);
  const ready = useRef(false);
  const invalidate = useThree((s) => s.invalidate);
  const theme = useEnvironment((s) => s.theme);
  const phase = useEnvironment((s) => s.phase);
  const weather = useEnvironment((s) => s.weather);
  const view = useNavigation((s) => s.view);
  const entered = useNavigation((s) => s.entered);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    for (const name of Object.values(contract).flat())
      if (!clone.getObjectByName(name))
        throw new Error(`Missing scene node: ${name}`);
    clone.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = !object.name.includes('glass');
        object.receiveShadow = true;
        if (object.name.startsWith('city_')) {
          object.visible = false;
          object.castShadow = false;
        }
        object.material = Array.isArray(object.material)
          ? object.material.map((m) => m.clone())
          : object.material.clone();
        for (const material of [object.material].flat())
          if (material instanceof MeshStandardMaterial)
            refineMaterial(material);
        if (
          object.name === 'window_mullion' &&
          object.material instanceof MeshStandardMaterial
        ) {
          object.material.color.set('#485154');
          object.material.metalness = 0.15;
          object.material.roughness = 0.78;
        }
        if (object.name === 'sky_panel') {
          for (const material of [object.material].flat()) material.dispose();
          object.material = createWindowLandscape();
          object.geometry = screenGeometry(object.geometry);
          const size = object.geometry.boundingBox!.getSize(new Vector3());
          object.material.uniforms.aspect.value = size.x / size.z;
          object.castShadow = false;
          object.receiveShadow = false;
        }
        if (object.name === contract.Projects) {
          object.geometry = screenGeometry(object.geometry);
          object.castShadow = false;
        }
      }
    });
    clone.updateMatrixWorld(true);
    return clone;
  }, [scene]);
  const animateRain = weather === 'rain' && !reducedMotion && visible;
  useEffect(() => {
    // Restart demand rendering when rain, visibility, or motion preferences change.
    invalidate();
  }, [animateRain, invalidate]);
  const anchors = useMemo(() => {
    const center = (name: string) =>
      new Box3()
        .setFromObject(model.getObjectByName(name)!)
        .getCenter(new Vector3());
    return {
      monitor: center(contract.Projects).add(new Vector3(0, -0.05, -0.24)),
      notebook: center(contract.About[0]).add(new Vector3(0, -0.08, 0.08)),
      window: center(contract.Environment).add(new Vector3(0, -0.1, 0.46)),
      switch: center(contract.Theme).add(new Vector3(0.1, -0.1, 0)),
    };
  }, [model]);
  useEffect(() => {
    const screen = model.getObjectByName(contract.Projects) as Mesh;
    const material = screen.material as MeshStandardMaterial;
    let active = true;
    const texture = new TextureLoader().load(
      projects[1].image.src,
      () => {
        if (!active) return;
        texture.colorSpace = SRGBColorSpace;
        material.map = texture;
        material.emissiveMap = texture;
        material.color.set('#ffffff');
        material.emissive.set('#ffffff');
        material.roughness = 0.65;
        material.metalness = 0;
        material.needsUpdate = true;
        invalidate();
      },
      undefined,
      () => {
        // Keep the original emissive screen when the optional preview fails.
      },
    );
    return () => {
      active = false;
      material.map = null;
      material.emissiveMap = null;
      texture.dispose();
    };
  }, [model, invalidate]);
  useEffect(() => {
    const landscape = (model.getObjectByName('sky_panel') as Mesh)
      .material as ShaderMaterial;
    const palette = landscapePalettes[phase];
    ['zenith', 'horizon', 'distant', 'nearCity'].forEach((key, index) => {
      landscape.uniforms[key].value.set(palette[index]);
    });
    landscape.uniforms.night.value =
      phase === 'night' ? 1 : phase === 'sunset' ? 0.3 : 0;
    landscape.uniforms.rain.value = weather === 'rain' ? 1 : 0;
    model.traverse((object) => {
      if (
        !(object instanceof Mesh) ||
        !(object.material instanceof MeshStandardMaterial)
      )
        return;
      const material = object.material;
      if (material.name === 'Screen_Emissive')
        material.emissiveIntensity = theme === 'dark' ? 0.65 : 0.35;
      if (material.name === 'Warm_Emissive')
        material.emissiveIntensity = theme === 'dark' ? 1.2 : 1.8;
      if (material.name === 'City_Window')
        material.emissiveIntensity = phase === 'night' ? 1.8 : 0.3;
      if (object.name === contract.Environment) {
        material.transparent = true;
        material.opacity = weather === 'rain' ? 0.12 : 0.035;
        material.metalness = 0;
        material.depthWrite = false;
        material.roughness = weather === 'rain' ? 0.8 : 0.65;
      }
    });
    invalidate();
  }, [model, theme, phase, weather, invalidate]);
  useEffect(
    () => () => {
      model.traverse((object) => {
        if (
          object instanceof Mesh &&
          (object.name === contract.Projects || object.name === 'sky_panel')
        )
          object.geometry.dispose();
        if (object instanceof Mesh)
          for (const material of [object.material].flat()) material.dispose();
      });
      document.body.style.cursor = '';
    },
    [model],
  );
  useFrame((_, delta) => {
    if (animateRain) {
      const landscape = (model.getObjectByName('sky_panel') as Mesh)
        .material as ShaderMaterial;
      // Avoid a jump when returning from a hidden tab or a suspended frame.
      landscape.uniforms.time.value += Math.min(delta, 0.05);
      invalidate();
    }
    if (!ready.current) {
      ready.current = true;
      useNavigation.setState({ ready: true });
    }
  });
  const click = (event: ThreeEvent<MouseEvent>) => {
    const run = action(event.object.name);
    if (run) {
      event.stopPropagation();
      run();
    }
  };
  return (
    <>
      <primitive
        object={model}
        onClick={click}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => {
          document.body.style.cursor = action(event.object.name)
            ? 'pointer'
            : '';
          const screen = model.getObjectByName(contract.Projects) as Mesh;
          (screen.material as MeshStandardMaterial).emissiveIntensity =
            (theme === 'dark' ? 0.65 : 0.35) +
            (event.object.name === contract.Projects ? 0.15 : 0);
          invalidate();
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
          const screen = model.getObjectByName(contract.Projects) as Mesh;
          (screen.material as MeshStandardMaterial).emissiveIntensity =
            theme === 'dark' ? 0.65 : 0.35;
          invalidate();
        }}
      />
      {view === 'home' && entered && (
        <>
          <Monitor position={anchors.monitor} />
          <Notebook position={anchors.notebook} />
          <Window position={anchors.window} />
          <LightSwitch position={anchors.switch} />
        </>
      )}
    </>
  );
}
function Monitor({ position }: { position: Vector3 }) {
  return (
    <Hotspot
      position={position}
      label="Projects"
      detail="모니터에서 프로젝트 보기"
      onClick={() => useNavigation.getState().navigate('projects')}
    />
  );
}
function Notebook({ position }: { position: Vector3 }) {
  return (
    <Hotspot
      position={position}
      label="About"
      detail="노트에서 소개 보기"
      onClick={() => useNavigation.getState().navigate('about')}
    />
  );
}
function Window({ position }: { position: Vector3 }) {
  return (
    <Hotspot
      position={position}
      label="Outside"
      detail="창문 환경 설정"
      onClick={() => useNavigation.getState().navigate('window')}
    />
  );
}
function LightSwitch({ position }: { position: Vector3 }) {
  return (
    <Hotspot
      position={position}
      label="Light"
      detail="방 조명 전환"
      onClick={() => useEnvironment.getState().toggleTheme()}
    />
  );
}
