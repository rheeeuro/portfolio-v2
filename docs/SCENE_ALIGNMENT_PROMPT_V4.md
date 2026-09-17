# Codex / Blender Scene Alignment Prompt v4

Read these files before changing anything:
1. `DESIGN_SPEC.md`
2. `SCENE_ALIGNMENT_V4.md`
3. `assets/3d/SCENE_SPEC_V3.json`
4. `concept-art.png`

Use `assets/3d/developer_room_concept_v3.glb` as the source scene. Do NOT rebuild the room from scratch.

Goal: create a v4 scene-alignment pass that matches the approved concept art's **Warm & Real** Home composition while preserving every interaction node contract.

Work in this order:
1. import v3 scene;
2. establish exact Home render aspect ratio;
3. use concept art as camera/reference overlay;
4. tune Home camera first using the starting values in `SCENE_ALIGNMENT_V4.md`;
5. align major silhouettes: desk → window → monitor → chair → wall/shelf → lamp → notebook → speakers;
6. validate realistic scale;
7. correct occlusion/intersection issues;
8. create Projects/About/Experience/Window camera presets;
9. perform clay-material QA render;
10. apply warm cinematic lighting and perform final QA;
11. export `developer_room_concept_v4.glb` without renaming required interaction nodes;
12. write `SCENE_SPEC_V4.json` containing final transforms and camera values;
13. write `QA_V4.md` with before/after observations and unresolved differences.

Never break these exact nodes:
- `monitor_monitor_screen`
- `notebook_page_left`
- `notebook_page_right`
- `switch_switch_toggle`
- `window_glass`
- `speakerL_woofer`
- `speakerR_woofer`

Do not solve visual mismatch by adding excessive geometry. Camera, scale, placement, silhouette, material response and lighting have priority.

Do not proceed to new GLSL/WebGPU effects until the clay-material Home frame passes composition QA.
