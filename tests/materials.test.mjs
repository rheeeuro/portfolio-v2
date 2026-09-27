import test from 'node:test';
import assert from 'node:assert/strict';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { screenGeometry } from '../src/components/room/materials.ts';

test('screen UV projection keeps the GLB geometry intact and image upright', () => {
  const original = new BufferGeometry();
  original.setAttribute(
    'position',
    new Float32BufferAttribute(
      [-0.25, 0.72, 0.95, 0.4, 0.72, 0.95, -0.25, 0.72, 1.36, 0.4, 0.72, 1.36],
      3,
    ),
  );
  const projected = screenGeometry(original);
  assert.equal(original.getAttribute('uv'), undefined);
  assert.notEqual(projected, original);
  assert.deepEqual(
    Array.from(projected.getAttribute('uv').array),
    [0, 0, 1, 0, 0, 1, 1, 1],
  );
  assert.deepEqual(
    projected.getAttribute('position').array,
    original.getAttribute('position').array,
  );
  projected.dispose();
  original.dispose();
});
