# Marswalk Planner: Jezero Crater

**Team Prithvi**

A layered EVA (Marswalk) planning map for the first human explorers on Mars. Built for NASA Space Apps 2026: *Interplanetary Survival Guide: Martian Map*.

**Live app:** https://0xr4j.github.io/mars-walk-planner/

**Guided tour mode (self-playing, with narration):** https://0xr4j.github.io/mars-walk-planner/?tour

**Slides:** [Marswalk_Planner_Slides.pdf](Marswalk_Planner_Slides.pdf)
## What it does
- **Layered NASA data** with toggles and opacity sliders, served live from NASA/JPL Mars Trek:
  - Optical: Viking MDIM 2.1, MRO CTX 6 m, MRO HiRISE 25 cm (Jezero)
  - Thermal: Mars Odyssey THEMIS IR day and night, MGS TES thermal inertia
  - Topographic: MGS MOLA + Mars Express HRSC color hillshade
- **EVA route** from the habitat (near Perseverance's landing site) to four science stops: Séítah, Máaz, the delta front, and the upper fan boulders. Each stop has a science objective, supporting data and kit list.
- **Custom routes:** click to add waypoints. Distances use Mars-radius haversine (3389.5 km).
- **Safety engine:** walking time, science time, consumables margin, hazard-zone crossing detection and a GO / CAUTION / NO-GO status.
- **Walk-back radius ring:** the furthest point the crew can reach and still return with a 1 h reserve.
- **Live space weather** from the NASA DONKI API (flares, CMEs, SEP events), with a shelter advisory.
- **HUD mode:** a helmet-visor style display showing the next stop, consumables, route and space weather.

## Honesty notes
Science-stop locations and hazard polygons are approximate planning annotations. They are not measured boundaries. Space weather is observed from Earth/L1, so it is advisory for Mars.

## Team Prithvi: who did what

We split the project equally: every member wrote code, did research, and worked on the presentation.

| Member | Code | Research & data | Presentation |
|---|---|---|---|
| **Raj Jha** | Built the core map in Leaflet (EPSG:4326) and integrated the NASA/JPL Mars Trek WMTS layers, with layer toggles and opacity sliders | Searched the Mars Trek catalogue and tested each layer's product IDs, zoom limits and coverage bounds; chose Jezero Crater as the site | Set up the GitHub repo and Pages deployment; wrote the README |
| **Nikhil Kumar** | Wrote the safety engine (Mars-radius distance maths, EVA time, consumables margin, GO / CAUTION / NO-GO) and the live NASA DONKI space-weather panel | Researched the four science stops (Séítah, Máaz, the delta front, the upper fan) and the radiation context (Curiosity RAD dose) | Wrote the narration for the guided tour mode |
| **Suryansh Pratap Singh** | Designed the UI and helmet HUD mode, and built the self-playing guided tour mode | Researched the thermal (THEMIS, TES) and topographic (MOLA/HRSC) data and mapped the hazard zones (dunes, scarp, boulder field) | Designed the presentation slides |

## Use of AI
The concept, site selection, science plan and design are Team Prithvi's own. We used an AI coding assistant (Claude) to speed up writing the code. The guided tour voice-over is synthetic browser text-to-speech. All imagery is real NASA mission data, with no AI-generated images.

## NASA data used
- NASA/JPL Mars Trek WMTS (trek.nasa.gov): `Mars_Viking_MDIM21_ClrMosaic_global_232m`, `Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd_200mpp_lzw`, `JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0`, `JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd`, `THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018`, `THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018`, `TES_Thermal_Inertia`
- NASA CCMC DONKI space weather API (api.nasa.gov)
- Mars 2020 Perseverance mission science and raw images (mars.nasa.gov)
- Curiosity RAD surface radiation dose (Hassler et al., Science, 2014)
- Mars Express HRSC topography is ESA data, provided through the MOLA/HRSC blend on Mars Trek

## Other references and tools
Leaflet 1.9.4 (BSD-2), served from cdnjs · Google Fonts (Inter, JetBrains Mono, Space Grotesk; SIL OFL) · GitHub Pages hosting

## Tech
A single static HTML file using Leaflet (EPSG:4326) and Mars Trek WMTS tiles. No build step.
