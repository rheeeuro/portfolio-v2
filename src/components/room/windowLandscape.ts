import { Color, ShaderMaterial } from 'three';

export const landscapePalettes = {
  dawn: ['#7e91af', '#e7c9bd', '#959baa', '#6b7e89'],
  day: ['#7dabc6', '#d9e1dd', '#9eafb4', '#788f98'],
  sunset: ['#858ca6', '#edc0a0', '#a89ba4', '#797f93'],
  night: ['#101c32', '#35465e', '#303e53', '#202d41'],
} as const;

export function createWindowLandscape() {
  return new ShaderMaterial({
    name: 'WindowLandscape',
    uniforms: {
      zenith: { value: new Color() },
      horizon: { value: new Color() },
      distant: { value: new Color() },
      nearCity: { value: new Color() },
      night: { value: 0 },
      rain: { value: 0 },
      time: { value: 0 },
      aspect: { value: 1 },
    },
    vertexShader: `
      varying vec2 landscapeUv;
      void main() {
        landscapeUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 landscapeUv;
      uniform vec3 zenith, horizon, distant, nearCity;
      uniform float night, rain, time, aspect;
      float hash(float x) { return fract(sin(x * 127.1) * 43758.5453); }
      float skyline(vec2 p, float scale, float base, float seed) {
        float block = floor(p.x * scale);
        float height = base + hash(block + seed) * 0.105;
        float roof = (1.0 - smoothstep(height - 0.002, height + 0.002, p.y));
        float gap = step(0.07, fract(p.x * scale));
        return roof * gap;
      }
      // xy: refraction, z: water coverage, w: a small reflected highlight.
      // Each column travels at its own speed; positive UV motion makes drops fall.
      vec4 droplets(vec2 uv, float scale, float seed) {
        vec2 grid = vec2(uv.x * aspect, uv.y) * scale;
        float column = floor(grid.x);
        grid.y += hash(column + seed + 9.0) * 7.0
          + time * (0.18 + hash(column + seed) * 0.22);
        vec2 cell = floor(grid);
        float random = hash(cell.x * 17.0 + cell.y * 73.0 + seed);
        vec2 p = fract(grid) - 0.5;
        p.x -= (random - 0.5) * 0.48;
        p.x += sin(time * 0.65 + random * 6.283 + p.y * 3.0) * 0.025;
        vec2 shape = p / vec2(0.115, 0.19);
        float radius = length(shape);
        float bead = 1.0 - smoothstep(0.65, 1.0, radius);
        float trail = (1.0 - smoothstep(0.012, 0.035, abs(p.x)))
          * smoothstep(0.06, 0.2, p.y) * (1.0 - smoothstep(0.3, 0.49, p.y));
        float present = smoothstep(0.2, 0.45, random);
        vec2 bend = shape * bead * 0.018 + vec2(p.x * trail * 0.10, 0.0);
        float glint = (1.0 - smoothstep(0.08, 0.32, length(shape - vec2(-0.28, 0.38)))) * bead;
        return vec4(bend, bead + trail * 0.25, glint) * present;
      }
      vec3 landscape(vec2 p) {
        vec3 color = mix(horizon, zenith, smoothstep(0.2, 1.0, p.y));
        // Broad, quiet cloud bands rather than repeating high-contrast shapes.
        float clouds = exp(-pow((p.y - 0.70 - 0.025 * sin(p.x * 8.0)) * 28.0, 2.0));
        clouds += 0.5 * exp(-pow((p.y - 0.83 + 0.02 * sin(p.x * 5.0)) * 36.0, 2.0));
        color = mix(color, horizon, clouds * (1.0 - night) * 0.22);
        float ridge = 0.33 + 0.025 * sin(p.x * 12.0) + 0.016 * sin(p.x * 23.0 + 2.0);
        color = mix(color, mix(horizon, distant, 0.45), 1.0 - smoothstep(ridge, ridge + 0.025, p.y));
        color = mix(color, distant, skyline(p, 37.0, 0.17, 9.0) * 0.75);
        float city = skyline(p, 23.0, 0.12, 41.0);
        color = mix(color, nearCity, city * 0.8);
        // Small scattered lights only after dusk; no oversized daytime windows.
        vec2 cell = vec2(p.x * 138.0, p.y * 95.0);
        vec2 inset = abs(fract(cell) - 0.5);
        float light = (1.0 - smoothstep(0.10, 0.23, inset.x)) * (1.0 - smoothstep(0.08, 0.19, inset.y));
        light *= step(0.83, hash(floor(cell.x) + floor(cell.y) * 71.0)) * city * night;
        color = mix(color, vec3(0.72, 0.48, 0.24), light * 0.55);
        // Atmospheric haze softens the horizon and wet-weather contrast.
        color = mix(color, horizon, exp(-pow((p.y - 0.29) * 9.0, 2.0)) * 0.18);
        color = mix(color, mix(horizon, distant, 0.5), rain * 0.3);
        return color;
      }
      void main() {
        vec2 p = landscapeUv;
        vec4 water = vec4(0.0);
        if (rain > 0.0) {
          water = droplets(p, 13.0, 19.0);
          water += droplets(p + vec2(0.37, 0.19), 23.0, 83.0) * 0.45;
        }
        vec2 refraction = water.xy * vec2(1.0 / aspect, 1.0) * rain;
        vec3 color = landscape(clamp(p + refraction, 0.0, 1.0));
        // Subtle dark edges and cool highlights keep the glass legible at night.
        color *= 1.0 - min(water.z, 1.0) * rain * 0.10;
        color += mix(horizon, vec3(0.72, 0.82, 0.9), 0.35) * water.w * rain * 0.22;
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
    toneMapped: false,
  });
}
