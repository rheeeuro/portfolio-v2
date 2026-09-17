'use client';
import { useEffect, useMemo, useRef } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Box3, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { sceneSpec, sceneUrl, type View } from '@/lib/scene';
import { useNavigation } from '@/stores/navigation';
import { useEnvironment } from '@/stores/environment';
import { toggleAudio } from '@/stores/audio';
import { skyColors } from './EnvironmentController';
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
export function RoomModel() {
  const { scene } = useGLTF(sceneUrl);
  const ready = useRef(false);
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
        object.material = Array.isArray(object.material)
          ? object.material.map((m) => m.clone())
          : object.material.clone();
      }
    });
    clone.updateMatrixWorld(true);
    return clone;
  }, [scene]);
  const anchors = useMemo(() => {
    const center = (name: string) =>
      new Box3()
        .setFromObject(model.getObjectByName(name)!)
        .getCenter(new Vector3());
    return {
      monitor: center(contract.Projects).add(new Vector3(0, -0.05, 0)),
      notebook: center(contract.About[0]).add(new Vector3(0, -0.08, 0.08)),
      window: center(contract.Environment).add(new Vector3(0, -0.1, 0.46)),
      switch: center(contract.Theme).add(new Vector3(0.1, -0.1, 0)),
    };
  }, [model]);
  useEffect(() => {
    model.traverse((object) => {
      if (
        !(object instanceof Mesh) ||
        !(object.material instanceof MeshStandardMaterial)
      )
        return;
      const material = object.material;
      if (material.name === 'Sky_Sunset') {
        material.color.set(skyColors[phase]);
        material.emissive.set(skyColors[phase]);
        material.emissiveIntensity = phase === 'day' ? 0.8 : 0.4;
      }
      if (material.name === 'Screen_Emissive')
        material.emissiveIntensity = theme === 'dark' ? 1.5 : 0.6;
      if (material.name === 'City_Window')
        material.emissiveIntensity = phase === 'night' ? 1.8 : 0.3;
      if (object.name === contract.Environment) {
        material.transparent = true;
        material.opacity = weather === 'rain' ? 0.4 : 0.13;
        material.depthWrite = false;
        material.roughness = weather === 'rain' ? 0.55 : 0.12;
      }
    });
  }, [model, theme, phase, weather]);
  useEffect(
    () => () => {
      model.traverse((object) => {
        if (object instanceof Mesh)
          for (const material of [object.material].flat()) material.dispose();
      });
      document.body.style.cursor = '';
    },
    [model],
  );
  useFrame(() => {
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
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
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
