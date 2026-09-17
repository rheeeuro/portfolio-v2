# Implementation plan — first milestone

## Source decisions

- Read `docs/CODEX_START_PROMPT.md` and all design/alignment documents.
- The root README explicitly supersedes older v3 references: use the supplied v4 GLB and `SCENE_SPEC_V4.json` without changing node names or camera values.
- Preserve the asset's Z-up coordinate system and camera contract.
- Build the working MVP first; defer new shaders, WebGPU, Playground and v4 modeling work.

## Steps

1. Foundation: Next.js App Router, React, strict TypeScript, ESLint, Prettier, CSS Modules, metadata.
2. Separate navigation/environment/audio stores; hash navigation and browser history; system theme and local-time initialization.
3. Lazy-load supplied GLB, validate node contract, use preset camera interpolation and practical lighting. Expose matching accessible DOM controls.
4. Boot readiness gated on mounted scene; graceful HTML content fallback if loading/WebGL fails.
5. Monitor → Projects HTML, notebook → About SVG, Experience placeholder; environment controls and opt-in Web Audio.
6. Mobile scroll content, reduced motion, capped DPR, hidden-tab rendering pause.
7. Verify types/lint/build and browser flows; document results and remaining scope in README.

## Content boundary

Project and career content is explicitly sample/placeholder content until real portfolio data is supplied. No invented achievements or live contact links.

## Implementation status

- Foundation, v4 scene integration, state separation, boot, camera navigation, HTML overlays, environment and opt-in audio implemented.
- Responsive content, reduced-motion handling, demand rendering and HTML fallback implemented.
- Same-view navigation regression covered: repeated menu clicks must not leave the panel awaiting a camera animation that never starts.
- Three.js 0.186 removed PCFSoftShadowMap; use PCFShadowMap while preserving the original scene JSON.
- Browser verification was stopped on the user's instruction. Continue only static review, types, lint, build and Node tests; visual/composition acceptance remains pending.
