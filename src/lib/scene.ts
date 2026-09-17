import spec from '../../assets/3d/SCENE_SPEC_V4.json';
export const sceneSpec = spec;
export const sceneUrl = '/assets/3d/developer_room_concept_v4.glb';
export type View = 'home' | 'projects' | 'about' | 'experience' | 'window';
export const views: View[] = [
  'home',
  'projects',
  'about',
  'experience',
  'window',
];
export function parseView(hash: string): View {
  const value = hash.replace('#', '');
  return views.includes(value as View) ? (value as View) : 'home';
}
export const tuple = (value: number[]): [number, number, number] => [
  value[0],
  value[1],
  value[2],
];
