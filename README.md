# Marswalk Planner: Jezero Crater

**Team Prithvi**

A layered EVA (Marswalk) planning map for the first human explorers on Mars. Built for NASA Space Apps 2026: *Interplanetary Survival Guide: Martian Map*.

**🚀 Live demo:** https://0xr4j.github.io/mars-walk-planner/

**📊 Slides:** [Marswalk_Planner_Slides.pdf](Marswalk_Planner_Slides.pdf)

**🎬 Demo video script:** [DEMO_SCRIPT.md](DEMO_SCRIPT.md)

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

## Tech
A single static HTML file using Leaflet (EPSG:4326) and Mars Trek WMTS tiles. No build step.
