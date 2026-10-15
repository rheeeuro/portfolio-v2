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
      // Independent motion: fast airborne rain, slow water attached to the glass.
      const float AIR_RAIN_SPEED = 0.85;
      const float GLASS_FLOW_SPEED = 0.28;
      float hash(float x) { return fract(sin(x * 127.1) * 43758.5453); }
      float skyline(vec2 p, float scale, float base, float seed) {
        float block = floor(p.x * scale);
        float height = base + hash(block + seed) * 0.105;
        float roof = (1.0 - smoothstep(height - 0.002, height + 0.002, p.y));
        float gap = step(0.07, fract(p.x * scale));
        return roof * gap;
      }
      float fallingRain(vec2 uv, float density, float seed) {
        // A slight wind slant and narrow streaks distinguish rain from round beads.
        vec2 grid = vec2(uv.x * aspect + uv.y * 0.12, uv.y)
          * vec2(42.0, 9.0) * density;
        float column = floor(grid.x);
        grid.y += hash(column + seed) * 11.0
          + time * AIR_RAIN_SPEED * (0.8 + hash(column + seed + 3.0) * 0.4)
            * 9.0 * density;
        vec2 cell = floor(grid);
        float random = hash(cell.x * 31.0 + cell.y * 97.0 + seed);
        vec2 p = fract(grid) - 0.5;
        p.x -= (random - 0.5) * 0.6;
        float streak = (1.0 - smoothstep(0.018, 0.075, abs(p.x)))
          * smoothstep(-0.34, -0.24, p.y)
          * (1.0 - smoothstep(-0.1, 0.36, p.y));
        return streak * smoothstep(0.25, 0.55, random);
      }
      // Randomly scattered pinned beads, with a sparse population of slow rivulets.
      // Neighbor sampling lets drops cross cell boundaries without revealing a grid.
      vec4 droplets(vec2 uv) {
        vec2 glass = vec2(uv.x * aspect, uv.y) * 18.0;
        // Derive pixel size before cell hashing: derivatives of randomized shapes
        // jump at cell boundaries and would draw faint rectangular seams.
        float pixelSize = length(fwidth(glass));
        vec2 origin = floor(glass);
        vec4 water = vec4(0.0);
        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 cell = origin + vec2(float(x), float(y));
            float id = cell.x * 127.1 + cell.y * 311.7;
            float chance = hash(id + 7.0);
            if (chance < 0.38) continue;
            float moving = step(0.84, chance);
            float sizeRandom = hash(id + 23.0);
            float size = mix(0.025, 0.14, pow(sizeRandom, 2.5));
            size = mix(size, 0.13 + sizeRandom * 0.07, moving);
            float cycle = time * GLASS_FLOW_SPEED / (3.5 + hash(id + 41.0) * 5.0)
              + hash(id + 53.0);
            float progress = fract(cycle);
            float life = mix(1.0, smoothstep(0.0, 0.12, progress)
              * (1.0 - smoothstep(0.8, 1.0, progress)), moving);
            float run = smoothstep(0.18, 0.88, progress);
            vec2 center = cell + vec2(0.1) + vec2(hash(id), hash(id + 11.0)) * 0.8;
            center.y += moving * (0.65 - run * 1.3);
            center.x += moving * sin(run * 5.0 + id) * 0.06;
            vec2 p = glass - center;
            float elongation = mix(0.85 + hash(id + 61.0) * 0.5, 1.65, moving);
            // Narrower at the top, with individual asymmetry instead of identical ovals.
            vec2 shape = p / vec2(size, size * elongation);
            shape.x *= 1.0 + clamp(shape.y, -1.0, 1.0) * (0.12 + moving * 0.12);
            shape.x += shape.y * (hash(id + 79.0) - 0.5) * 0.22;
            float radius = length(shape);
            float edge = clamp(pixelSize / (size * min(elongation, 1.0)), 0.035, 0.28);
            float bead = 1.0 - smoothstep(1.0 - edge, 1.0 + edge, radius);
            float dome = sqrt(max(0.0, 1.0 - min(radius * radius, 1.0)));
            float trailLength = 0.25 + run * 0.45;
            float trailX = p.x + sin(p.y * 8.0 + id) * 0.012;
            float trail = moving * (1.0 - smoothstep(0.008, 0.025, abs(trailX)))
              * smoothstep(size, size * 2.0, p.y)
              * (1.0 - smoothstep(trailLength * 0.4, trailLength, p.y));
            vec2 bend = shape * dome * bead * mix(0.004, 0.011, moving);
            float rim = bead * smoothstep(0.55, 0.95, radius);
            float glint = rim * pow(max(0.0, dot(normalize(shape + vec2(0.001)),
              normalize(vec2(-0.5, 0.8)))), 8.0);
            water += vec4(bend, rim * 0.55 + trail * 0.12,
              glint * 0.55 + trail * 0.06) * life;
          }
        }
        return water;
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
        // Outdoor rain belongs to the landscape, behind the refracting glass.
        if (rain > 0.0) {
          float streaks = fallingRain(p, 1.0, 127.0);
          streaks += fallingRain(p + vec2(0.23, 0.41), 1.6, 263.0) * 0.45;
          color = mix(color, vec3(0.65, 0.76, 0.84), min(streaks, 1.0) * rain * 0.42);
        }
        return color;
      }
      void main() {
        vec2 p = landscapeUv;
        vec4 water = vec4(0.0);
        if (rain > 0.0) {
          water = droplets(p);
        }
        vec2 refraction = water.xy * vec2(1.0 / aspect, 1.0) * rain;
        vec3 color = landscape(clamp(p + refraction, 0.0, 1.0));
        // Defined edges and cool highlights read from the room's wide camera too.
        color *= 1.0 - min(water.z, 1.0) * rain * 0.22;
        color += mix(horizon, vec3(0.72, 0.82, 0.9), 0.5) * water.w * rain * 0.46;
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
    toneMapped: false,
  });
}
