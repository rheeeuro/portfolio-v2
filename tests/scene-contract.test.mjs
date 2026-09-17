import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const spec = JSON.parse(
  readFileSync(new URL('../assets/3d/SCENE_SPEC_V4.json', import.meta.url)),
);
const source = readFileSync(
  new URL('../assets/3d/developer_room_concept_v4.glb', import.meta.url),
);
const served = readFileSync(
  new URL('../public/assets/3d/developer_room_concept_v4.glb', import.meta.url),
);
const gltf = JSON.parse(
  source.toString('utf8', 20, 20 + source.readUInt32LE(12)),
);
test('served scene is the approved v4 binary', () =>
  assert.deepEqual(served, source));
test('all interactive mesh nodes survive the asset pipeline', () => {
  const names = gltf.nodes
    .filter((node) => node.mesh !== undefined)
    .map((node) => node.name);
  for (const name of Object.values(spec.interaction_contract).flat())
    assert.ok(names.includes(name), name);
});
test('runtime presets match the camera metadata embedded in the GLB', () => {
  assert.deepEqual(
    spec.camera_positions,
    gltf.scenes[0].extras.camera_positions,
  );
});
