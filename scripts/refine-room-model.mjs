// Refine the actual GLB while preserving node names, materials and camera metadata.
import fs from 'node:fs';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import {
  BoxGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Shape,
  Matrix4,
  LatheGeometry,
  Vector2,
  Quaternion,
  Vector3,
} from 'three';
const path = 'assets/3d/developer_room_concept_v4.glb';
const source = fs.readFileSync(process.argv[2] ?? path);
const jsonLength = source.readUInt32LE(12);
const gltf = JSON.parse(source.toString('utf8', 20, 20 + jsonLength));
if (gltf.scenes[0].extras.model_refinement === 1) process.exit(0);
const chunks = [source.subarray(28 + jsonLength)];
let byteLength = chunks[0].length;
function accessor(array, itemSize, target) {
  const data = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
  const view =
    gltf.bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: data.length,
      target,
    }) - 1;
  chunks.push(data);
  byteLength += data.length;
  const padding = (4 - (byteLength % 4)) % 4;
  if (padding) {
    chunks.push(Buffer.alloc(padding));
    byteLength += padding;
  }
  const a = {
    bufferView: view,
    componentType:
      array instanceof Float32Array
        ? 5126
        : array instanceof Uint32Array
          ? 5125
          : 5123,
    count: array.length / itemSize,
    type: itemSize === 1 ? 'SCALAR' : 'VEC3',
  };
  if (target === 34962) {
    a.min = Array.from({ length: itemSize }, (_, k) => {
      let v = Infinity;
      for (let i = k; i < array.length; i += itemSize)
        v = Math.min(v, array[i]);
      return v;
    });
    a.max = Array.from({ length: itemSize }, (_, k) => {
      let v = -Infinity;
      for (let i = k; i < array.length; i += itemSize)
        v = Math.max(v, array[i]);
      return v;
    });
  }
  return gltf.accessors.push(a) - 1;
}
function mesh(name, geometry, material) {
  let node = gltf.nodes.find((n) => n.name === name);
  if (!node) {
    node = { name };
    gltf.nodes[0].children.push(gltf.nodes.length);
    gltf.nodes.push(node);
  }
  material ??= gltf.meshes[node.mesh].primitives[0].material;
  const attributes = {
    POSITION: accessor(geometry.attributes.position.array, 3, 34962),
    NORMAL: accessor(geometry.attributes.normal.array, 3, 34962),
  };
  const primitive = { attributes, material, mode: 4 };
  if (geometry.index)
    primitive.indices = accessor(geometry.index.array, 1, 34963);
  node.mesh = gltf.meshes.push({ name, primitives: [primitive] }) - 1;
  delete node.matrix;
  delete node.translation;
  delete node.scale;
  delete node.rotation;
  geometry.dispose();
}
function box(name, size, center, material) {
  mesh(name, new BoxGeometry(...size).translate(...center), material);
}
function transform(match, matrix) {
  for (const n of gltf.nodes.filter((n) => match(n.name)))
    n.matrix = matrix.toArray();
}
function move(match, x, y, z) {
  transform(match, new Matrix4().makeTranslation(x, y, z));
}
function pivot(match, center, scale, angle, offset) {
  const m = new Matrix4()
    .makeTranslation(...center)
    .multiply(new Matrix4().makeTranslation(...offset))
    .multiply(new Matrix4().makeRotationZ(angle))
    .multiply(new Matrix4().makeScale(...scale))
    .multiply(new Matrix4().makeTranslation(...center.map((v) => -v)));
  transform(match, m);
}
// Bring the desk beneath its props, and settle their bases onto the tabletop.
pivot(
  (n) => n.startsWith('desk_') && n !== 'desk_mat',
  [0, 0.94, 0],
  [1, 1.13, 1],
  0,
  [0, -0.27, 0],
);
move((n) => n.startsWith('notebook_'), 0, 0, -0.028);
move((n) => n.startsWith('lamp_'), 0, 0.18, -0.018);
move((n) => n.startsWith('speakerL_'), -0.035, 0.19, -0.028);
move((n) => n.startsWith('speakerR_'), -0.06, 0.19, -0.028);
move((n) => n.startsWith('monitor_monitor_'), 0, 0, -0.018);
move((n) => n === 'desk_mat', 0, 0, -0.019);
move((n) => n.startsWith('keyboard_') || n.startsWith('key_'), 0, 0, -0.012);
pivot(
  (n) => n === 'mouse_shell',
  [0.43, 0.34, 0.79],
  [1, 1.35, 0.48],
  0,
  [0, 0, -0.012],
);
move((n) => n.startsWith('mug_'), -0.17, 0, -0.033);
// Turn and move the chair clear of the notebook, with a proportionate upholstered back.
mesh(
  'chair_chair_back',
  new RoundedBoxGeometry(0.46, 0.075, 0.49, 3, 0.028).translate(
    -0.55,
    -0.4,
    0.91,
  ),
  18,
);
box('chair_chair_lumbar', [0.36, 0.035, 0.14], [-0.55, -0.45, 0.77], 18);
pivot(
  (n) => n.startsWith('chair_'),
  [-0.52, -0.58, 0],
  [0.94, 0.94, 0.94],
  -0.32,
  [-0.65, 0.28, 0.014],
);
// Replace the pinched solid lampshade with a hollow, downward-facing shade.
const shade = new LatheGeometry(
  [
    new Vector2(0.086, 0),
    new Vector2(0.035, 0.105),
    new Vector2(0.026, 0.105),
    new Vector2(0.076, 0.008),
    new Vector2(0.086, 0),
  ],
  32,
);
shade.applyQuaternion(
  new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    new Vector3(-0.38, 0, 0.925).normalize(),
  ),
);
shade.translate(-0.447, 0.765, 1.132);
mesh('lamp_lamp_shade', shade, 9);
move((n) => n === 'lamp_lamp_bulb', -0.03, 0.17, -0.02);
// Attach the pegboard to the left wall, instead of suspending it in the room.
pivot(
  (n) => n === 'experience_board' || n.startsWith('peg_'),
  [-1.85, 0.78, 1.75],
  [1, 1, 1],
  Math.PI / 2,
  [-0.49, 0, 0],
);
move((n) => n.startsWith('book_'), 0, 0.08, -0.11);
move((n) => n.startsWith('plant_') && n.includes('-1.34'), 0, 0, -0.04);
move((n) => n.startsWith('plant_') && n.includes('1.48'), 0.1, 0, -0.403);
// Open the wall behind the glazing so the existing exterior is actually visible.
box('wall_back', [1.745, 0.06, 2.7], [-1.5275, 1.8, 1.35], 2);
box('wall_back_right', [1.185, 0.06, 2.7], [1.8075, 1.8, 1.35], 2);
box('wall_back_below_window', [1.87, 0.06, 0.995], [0.28, 1.8, 0.4975], 2);
box('wall_back_above_window', [1.87, 0.06, 0.255], [0.28, 1.8, 2.5725], 2);
// Recess three fans into the PC fascia with dark hubs and copper rims.
for (const [i, z] of [0.17, 0.37, 0.57].entries()) {
  const old = ['0.2', '0.42', '0.63'][i];
  mesh(
    `pc_fan_${old}`,
    new CylinderGeometry(0.075, 0.075, 0.012, 32).translate(1.26, 0.944, z),
    8,
  );
  mesh(
    `pc_fan_ring_${i}`,
    new CylinderGeometry(0.065, 0.065, 0.013, 32).translate(1.26, 0.934, z),
    7,
  );
  mesh(
    `pc_fan_inset_${i}`,
    new CylinderGeometry(0.054, 0.054, 0.014, 32).translate(1.26, 0.925, z),
    19,
  );
  mesh(
    `pc_fan_hub_${i}`,
    new CylinderGeometry(0.021, 0.021, 0.015, 20).translate(1.26, 0.916, z),
    9,
  );
}
// A continuous, shallow acoustic body with a waist, soundhole, bridge and strings.
const outline = new Shape();
outline.moveTo(0, 0.55);
outline.bezierCurveTo(0.12, 0.56, 0.17, 0.49, 0.13, 0.39);
outline.bezierCurveTo(0.09, 0.32, 0.1, 0.3, 0.17, 0.23);
outline.bezierCurveTo(0.28, 0.08, 0.16, 0, 0, 0);
outline.bezierCurveTo(-0.16, 0, -0.28, 0.08, -0.17, 0.23);
outline.bezierCurveTo(-0.1, 0.3, -0.09, 0.32, -0.13, 0.39);
outline.bezierCurveTo(-0.17, 0.49, -0.12, 0.56, 0, 0.55);
const body = new ExtrudeGeometry(outline, {
  depth: 0.09,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 1,
  bevelSize: 0.008,
  bevelThickness: 0.008,
  curveSegments: 16,
});
body.rotateX(Math.PI / 2).translate(1.95, 1.5, 0.2);
mesh('guitar_body', body, 1);
// Replace the second sphere with a dark, inset soundhole.
mesh(
  'guitar_body_upper',
  new CylinderGeometry(0.055, 0.055, 0.004, 40).translate(1.95, 1.397, 0.58),
  19,
);
box('guitar_neck', [0.055, 0.035, 0.54], [1.95, 1.445, 0.98], 0);
box('guitar_fretboard', [0.052, 0.012, 0.52], [1.95, 1.419, 0.98], 19);
box('guitar_head', [0.075, 0.04, 0.14], [1.95, 1.44, 1.3], 1);
box('guitar_bridge', [0.115, 0.012, 0.025], [1.95, 1.395, 0.35], 0);
for (let i = 0; i < 6; i++)
  box(
    `guitar_string_${i}`,
    [0.0012, 0.002, 0.91],
    [1.933 + i * 0.0068, 1.386, 0.805],
    9,
  );
for (let i = 0; i < 10; i++)
  box(
    `guitar_fret_${i}`,
    [0.053, 0.003, 0.002],
    [1.95, 1.41, 0.77 + i * 0.046],
    9,
  );
box('guitar_wall_mount', [0.13, 0.28, 0.035], [1.95, 1.63, 1.22], 8);
gltf.scenes[0].extras.model_refinement = 1;
gltf.buffers[0].byteLength = byteLength;
let json = Buffer.from(JSON.stringify(gltf));
json = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 32)]);
const bin = Buffer.concat(chunks);
const header = Buffer.alloc(20);
header.writeUInt32LE(0x46546c67);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + json.length + bin.length, 8);
header.writeUInt32LE(json.length, 12);
header.writeUInt32LE(0x4e4f534a, 16);
const bh = Buffer.alloc(8);
bh.writeUInt32LE(bin.length);
bh.writeUInt32LE(0x004e4942, 4);
const output = Buffer.concat([header, json, bh, bin]);
fs.writeFileSync(path, output);
fs.writeFileSync('public/assets/3d/developer_room_concept_v4.glb', output);
console.log(`Refined ${gltf.nodes.length} nodes; ${output.length} bytes`);
