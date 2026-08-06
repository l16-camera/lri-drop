# LRI Drop

[![CI](https://github.com/l16-camera/lri-drop/actions/workflows/ci.yml/badge.svg)](https://github.com/l16-camera/lri-drop/actions/workflows/ci.yml)
[![Pages](https://github.com/l16-camera/lri-drop/actions/workflows/pages.yml/badge.svg)](https://github.com/l16-camera/lri-drop/actions/workflows/pages.yml)

**[Live demo / landing →](https://l16-camera.github.io/lri-drop/)** — interactive UI shell, [circahue](https://github.com/isamarin/circahue) accent dial, **why 16 DNGs** module map, product walkthrough.

Desktop **Tauri 2 + Svelte 5** converter for **Light L16**: drop `.lri` captures (or pull over **adb**), inspect modules, export **per-module** Adobe **DNG** — full set or **mono only** (A2 / C6) with optional PNG previews and a progress queue.

One L16 shutter is a multi-camera pack (up to **16 optical modules** in A/B/C banks). LRI Drop unpacks those separate sensor frames — it does not invent extra copies.

Depends on the **[luminat](https://github.com/isamarin/luminat)** crate `light` (LRI parse/extract). Brand chrome uses **[circahue](https://github.com/isamarin/circahue)** (`@igrs/circahue`) for a living circadian accent.

## Setup

```bash
# 1) luminat monorepo (provides `light`)
git clone https://github.com/isamarin/luminat.git ~/IGRS/luminat
# or: export LUMINAT_PATH=/path/to/luminat

# 2) link into this repo
./scripts/link-luminat.sh

# 3) frontend + rust
npm install
```

Requires: Rust, Node 20+, platform WebView deps (Xcode CLT on macOS; WebKitGTK on Linux), `adb` on PATH for camera features.

## Dev

```bash
# install Tauri CLI once
cargo install tauri-cli --version '^2'

npm run tauri dev
```

## Lint & check (same as CI)

```bash
npm run lint          # eslint (svelte + js)
npm run build         # vite production build
cargo fmt --all -- --check
cargo clippy -p lri-drop --all-targets --no-deps -- -D warnings
cargo build --release -p lri-drop
```

## Build

```bash
npm run tauri build
# or binary only:
cargo build --release -p lri-drop
```

## CI (GitHub Actions)

| Job | What |
| --- | --- |
| **Frontend** | `npm ci` · eslint · vite build · artifact `dist/` |
| **Rust · fmt & clippy** | checkout luminat → fmt · clippy (macOS) |
| **Build** | release binary matrix: **macOS aarch64**, **Windows x64**, **Linux x64** |
| **Tauri bundle** | on `v*` tags: app (macOS) · nsis (Windows) · deb (Linux) |

Artifacts (14 days): `lri-drop-macos-aarch64`, `lri-drop-windows-x64`, `lri-drop-linux-x64`.

Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Features

| Action | Result |
| --- | --- |
| Drop `.lri` | Inspect modules / mono tags, queue card |
| **From Light camera** | adb · `/sdcard/DCIM/Camera/*.lri` · pull → queue |
| **Convert** | `light::extract` → `<output>/<stem>/*.dng` (one DNG per module) |
| Mono only | `A2_mono.dng` / `C6_mono.dng` |
| Mono previews | `mono/A2.png` |
| Reveal | Open output folder (OS file manager) |

**Why many DNGs?** L16 banks A1–A5 · B1–B5 · C1–C6 — separate sensors/focals, not duplicates. See the [landing module map](https://l16-camera.github.io/lri-drop/#modules).

Camera pull cache (macOS): `~/Library/Caches/lri-drop/camera/` (platform cache dirs elsewhere).

## Relation to Luminat app

| | **LRI Drop** (this repo) | **Luminat** (`luminat` / `lumen`) |
| --- | --- | --- |
| Focus | Fast LRI → DNG | Full desktop “own Lumen” |
| Fusion | — | libcp quality render |
| Camera | yes | yes (M2) |

Same `light` library; different product shells.

## License

Same spirit as luminat / open L16 community tooling — isamarin × BLMK.
