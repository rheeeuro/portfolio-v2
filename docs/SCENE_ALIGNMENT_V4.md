# Developer's Room — Scene Alignment Spec v4

## Goal
Align the existing v3 GLB with the approved concept art before adding more modeling detail. v4 is a composition/alignment pass, not a remodel.

## Visual target
Use concept-art.png as the authoritative visual reference. The implementation should use the **Warm & Real** panel as the primary Home composition, while borrowing the cleaner spatial readability of **Stylized & Minimal**. Do not drift toward the Cyber & Night panel except when the runtime environment is night/rain.

### Home frame hierarchy
1. Monitor is the primary focal point and sits near the horizontal center.
2. Desk spans most of the lower-middle frame and anchors all interactions.
3. Window is the dominant background shape behind/above the monitor.
4. Chair is foreground-left/lower-left and must not hide the notebook or monitor.
5. Lamp is left of monitor and provides a warm practical-light focal point.
6. Small props add lived-in density but may not compete with Monitor / Notebook / Window.

## Coordinate convention
- Units: meters.
- Z = up.
- Preserve v3 interaction node names.
- Treat the room shell as the stable parent; move major furniture as grouped transforms.
- Apply transforms before final export where safe, but do not destroy animation pivots.

## Room envelope
Target room dimensions remain **4.8 W × 3.6 D × 2.7 H m**.

Do not resize the whole scene to solve composition problems. Fix camera first, then major object transforms.

## Alignment workflow
### Pass A — Camera match
Before moving furniture, match the Home camera to the concept-art silhouette.

Recommended starting point:
```json
{
  "position": [0.05, -3.75, 1.48],
  "target": [0.0, 0.72, 1.18],
  "fov": 39
}
```

Allowed tuning range:
- camera X: -0.15 … +0.15
- camera Y: -3.55 … -4.10
- camera Z: 1.38 … 1.58
- target Z: 1.08 … 1.28
- FOV: 36 … 42 degrees

Acceptance:
- monitor occupies roughly 22–30% of frame width;
- desk top is clearly readable;
- window remains visible around monitor;
- foreground chair creates depth without becoming the focal point;
- verticals should not feel strongly distorted.

### Pass B — Major anchors
Only after camera match, adjust grouped transforms in this order:
1. desk group
2. window group
3. monitor
4. chair
5. shelf / wall content
6. lamp
7. notebook
8. speakers
9. props

### Target visual placement
These are **screen-space targets**, more important than exact world coordinates.

| Element | Target in Home frame |
|---|---|
| Monitor | center X 48–52%, center Y 48–56% |
| Window | center X 50–58%, occupies upper-middle background |
| Desk top | Y 55–70%, spans ~65–80% frame width |
| Chair | lower-left/center-left, max ~25% frame width |
| Lamp | left of monitor, warm bulb visible |
| Notebook | visible on desk, left or left-front of monitor; never occluded |
| Speaker | monitor-adjacent, secondary focal point |
| Experience area | side wall, readable after dedicated camera move |
| Light switch | visible/reachable but not visually dominant |

## Object scale rules
Use realistic proportions as the baseline:
- desk: 1.60 × 0.75 × 0.72 m
- monitor: ~0.71 m wide, screen center around 1.10–1.25 m above floor
- chair overall height: ~1.05–1.15 m
- notebook: 0.21 × 0.148 m
- speaker: ~0.15 × 0.17 × 0.25 m
- lamp height: ~0.45 m
- light switch plate: 0.08 × 0.12 m
- window: approx. 1.8 × 1.4 m

Scale tolerance for visual alignment: ±10%. Anything beyond that needs an explicit reason.

## Detail corrections
### Desk
- Keep a thin, readable tabletop silhouette.
- Rounded/beveled edge should catch highlights.
- Avoid oversized drawers or legs that make the desk feel heavy.
- Keep enough clear surface around Notebook for the About interaction.

### Monitor
- Thin bezel; screen must remain a separate mesh: `monitor_monitor_screen`.
- Reduce bulky rear housing if it is visible from Home.
- Screen should face Home camera almost squarely.
- Stand/base should not visually merge into keyboard.

### Notebook
Preserve:
- `notebook_page_left`
- `notebook_page_right`

Requirements:
- closed/open geometry must not intersect desk;
- spine pivot remains usable for opening animation;
- notebook is readable from Home and clearly framed in About view.

### Window
Preserve `window_glass`.
- Increase perceived depth of frame with bevel/recess rather than high polygon count.
- City is a background layer, not dense 3D geometry.
- Blind/curtain must not obscure more than ~20% of the useful glass area in Home.

### Lamp
- Place on monitor-left side.
- Bulb/shade should create a clear warm practical-light source.
- Arm silhouette must not cross important monitor text.

### Chair
- Keep foreground depth but reduce visual dominance.
- Rotate slightly off-axis rather than pointing perfectly at camera.
- Do not block Notebook interaction raycast from the intended Home camera.

### Speakers
Preserve `speakerL_woofer` and `speakerR_woofer`.
- Keep both close enough to monitor to read as one workstation system.
- Speaker height should remain below monitor top.

### Experience wall
- Avoid dense geometry/text baked into GLB.
- Use the wall/board as a physical anchor; render actual Git-history information as DOM/SVG after camera arrival.

### Props
Props are allowed to differ from concept art. Their job is visual rhythm.
- Keep 20–30% of desk surface visually quiet.
- Use asymmetry.
- No prop may overlap an interaction hotspot in Home view.

## Interaction contract — MUST NOT BREAK
```json
{
  "Projects": "monitor_monitor_screen",
  "About": ["notebook_page_left", "notebook_page_right"],
  "Theme": "switch_switch_toggle",
  "Environment": "window_glass",
  "Sound": ["speakerL_woofer", "speakerR_woofer"]
}
```

## Camera presets v4
Use these as starting values; final values are determined by visual match.

```json
{
  "home": {
    "position": [0.05, -3.75, 1.48],
    "target": [0.0, 0.72, 1.18],
    "fov": 39
  },
  "projects": {
    "position": [0.02, -1.08, 1.23],
    "target": [0.0, 0.76, 1.16],
    "fov": 34
  },
  "about": {
    "position": [-0.58, -0.20, 1.28],
    "target": [-0.50, 0.47, 0.82],
    "fov": 30
  },
  "experience": {
    "position": [-1.12, -1.08, 1.62],
    "target": [-1.82, 0.78, 1.72],
    "fov": 34
  },
  "window": {
    "position": [0.42, -0.62, 1.52],
    "target": [0.45, 1.72, 1.70],
    "fov": 36
  }
}
```

## Lighting alignment
Do lighting after composition.

### Warm & Real / default Home
- ACESFilmic tone mapping
- exposure start: 1.0–1.1
- warm desk practical light on left
- cool/neutral window fill
- subtle monitor emissive
- shadows soft enough to retain desk detail

Lighting hierarchy:
1. window/environment = broad fill
2. lamp = warm local key/accent
3. monitor = subtle face/desk glow
4. ambient = minimum needed to avoid crushed blacks

Do not compensate for bad composition by over-lighting objects.

## Day / night contract
The geometry stays identical.

Day:
- brighter window
- weaker practical lights
- softer monitor emissive

Night:
- lower ambient
- stronger monitor emissive
- lamp/practical lights become important
- city lights appear
- optional rain shader on `window_glass`

## Blender overlay procedure
1. Set render resolution to the exact aspect ratio used by the Home website hero.
2. Add `concept-art.png` as Camera Background Image / reference.
3. Crop/reference the Warm & Real panel when matching Home.
4. Set opacity around 0.35–0.50.
5. Match camera before moving objects.
6. Toggle overlay repeatedly and align monitor/window/desk silhouettes.
7. Move grouped furniture only after the camera is within tolerance.
8. Render a clay/neutral-material comparison before final lighting.
9. Render Warm & Real lighting comparison.
10. Validate interaction views separately.

## QA checklist
### Composition
- [ ] Home silhouette reads like approved concept art.
- [ ] Monitor is obvious primary action.
- [ ] Notebook is visible and reachable.
- [ ] Window is a strong environmental background.
- [ ] Chair does not dominate or occlude interactions.
- [ ] Lamp gives left-side warm focal light.

### Geometry
- [ ] No visible intersections at Home camera.
- [ ] No floating props.
- [ ] Real-world scale is plausible.
- [ ] Bevels catch highlights on major hard-surface objects.

### Interaction
- [ ] All v3 interaction node names still exist exactly.
- [ ] Raycast target areas are not blocked.
- [ ] Notebook pivots remain animation-safe.
- [ ] Window glass remains a dedicated shader surface.

### Performance
- [ ] Do not increase geometry solely to improve flat surfaces.
- [ ] Prefer normal/material/shader detail over micro-geometry.
- [ ] Keep decorative props lazy-loadable where practical.
- [ ] Maintain mobile fallback strategy.

## Definition of Done
v4 is complete when a side-by-side comparison of the Home render and Warm & Real concept panel shows the same major visual hierarchy and silhouette even with neutral/clay materials. Fine prop identity does not need to match 1:1.

The final question is not “are all objects identical?” but “does the first frame feel like the same room and lead the eye to the same interactions?”
