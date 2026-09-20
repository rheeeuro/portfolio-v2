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

function bounds(name) {
  const node = gltf.nodes.find((node) => node.name === name);
  const primitive = gltf.meshes[node.mesh].primitives[0];
  const accessor = gltf.accessors[primitive.attributes.POSITION];
  const matrix = node.matrix ?? [
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
  ];
  const corners = [];
  for (const x of [accessor.min[0], accessor.max[0]])
    for (const y of [accessor.min[1], accessor.max[1]])
      for (const z of [accessor.min[2], accessor.max[2]])
        corners.push(
          [0, 1, 2].map(
            (i) =>
              matrix[i] * x +
              matrix[4 + i] * y +
              matrix[8 + i] * z +
              matrix[12 + i],
          ),
        );
  return {
    min: [0, 1, 2].map((i) => Math.min(...corners.map((p) => p[i]))),
    max: [0, 1, 2].map((i) => Math.max(...corners.map((p) => p[i]))),
  };
}

test('desk supports the notebook, lamp and monitor without floating bases', () => {
  const desk = bounds('desk_desk_top');
  for (const name of [
    'notebook_cover_back',
    'lamp_lamp_base',
    'monitor_monitor_stand_base',
    'speakerL_speaker_base',
    'speakerR_speaker_base',
  ]) {
    const prop = bounds(name);
    for (const axis of [0, 1]) {
      assert.ok(
        prop.min[axis] >= desk.min[axis] - 0.001,
        `${name} overhangs desk`,
      );
      assert.ok(
        prop.max[axis] <= desk.max[axis] + 0.001,
        `${name} overhangs desk`,
      );
    }
    assert.ok(
      Math.abs(prop.min[2] - desk.max[2]) < 0.002,
      `${name} must rest on the desktop`,
    );
  }
});

test('PC fans fit within the front panel', () => {
  const panel = bounds('pc_glass');
  for (const name of ['pc_fan_0.2', 'pc_fan_0.42', 'pc_fan_0.63']) {
    const fan = bounds(name);
    for (const axis of [0, 2]) {
      assert.ok(fan.min[axis] > panel.min[axis], `${name} outside panel`);
      assert.ok(fan.max[axis] < panel.max[axis], `${name} outside panel`);
    }
  }
});
