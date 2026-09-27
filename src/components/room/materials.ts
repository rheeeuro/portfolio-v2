import {
  BufferGeometry,
  Float32BufferAttribute,
  MeshStandardMaterial,
} from 'three';

// The supplied GLB has positions but no UVs. Project onto the front (XZ) face.
export function screenGeometry(source: BufferGeometry) {
  const geometry = source.clone();
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox!;
  const positions = geometry.getAttribute('position');
  const uv = new Float32Array(positions.count * 2);
  for (let i = 0; i < positions.count; i++) {
    uv[i * 2] = (positions.getX(i) - min.x) / (max.x - min.x);
    uv[i * 2 + 1] = (positions.getZ(i) - min.z) / (max.z - min.z);
  }
  geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  return geometry;
}

export function refineMaterial(material: MeshStandardMaterial) {
  switch (material.name) {
    case 'Wood_Walnut':
      material.roughness = 0.48;
      break;
    case 'Wood_Oak':
      material.roughness = 0.62;
      break;
    case 'Metal_Black':
      material.roughness = 0.36;
      material.metalness = 0.55;
      break;
    case 'Metal_Soft':
      material.roughness = 0.42;
      break;
    case 'Plastic_Matte':
      material.roughness = 0.78;
      material.metalness = 0;
      break;
    case 'Paper':
    case 'Fabric_Charcoal':
      material.roughness = 1;
      material.metalness = 0;
      break;
    case 'Ceramic':
      material.roughness = 0.23;
      break;
  }
}
