# LRI Drop

Simple **Tauri 2 + Svelte 5** app: drag-and-drop Light `.lri` → per-module Adobe **DNG**.

Smooth drop-zone animations, queue cards, mono-only toggle, sticky output folder.

## Dev

```bash
# from luminat root
make lri-drop
# or:
cd lri-drop
npm install
npm run tauri dev
```

## Release

```bash
make lri-drop-release
# binary: target/release/lri-drop  (via tauri)
```

## Features

| Action | Result |
| --- | --- |
| Drop `.lri` | Inspect modules / mono tags, queue card |
| **From Light camera** | Detect L16 via `adb`, browse `/sdcard/DCIM/Camera/*.lri`, multi-select, pull → queue |
| **Convert** | `light::extract` → `<output>/<stem>/*.dng` |
| Mono only | A2/C6 panchromatic planes (`A2_mono.dng`) |
| Mono previews | `mono/A2.png` gray previews |
| Click done path | Reveal in Finder |

Camera pulls cache under `~/Library/Caches/lri-drop/camera/` (skip re-download if size matches).

Requires `adb` on `PATH` (or `ADB=/path/to/adb`). USB: mtp,adb.

Uses the same `light` crate as the CLI (`light extract`).
