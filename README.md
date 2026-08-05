# LRI Drop

[![CI](https://github.com/l16-camera/lri-drop/actions/workflows/ci.yml/badge.svg)](https://github.com/l16-camera/lri-drop/actions/workflows/ci.yml)
[![Pages](https://github.com/l16-camera/lri-drop/actions/workflows/pages.yml/badge.svg)](https://github.com/l16-camera/lri-drop/actions/workflows/pages.yml)

**[Live demo / landing →](https://l16-camera.github.io/lri-drop/)** — interactive UI shell, [circahue](https://github.com/isamarin/circahue) accent dial, product walkthrough.

Desktop **Tauri 2 + Svelte 5** converter for **Light L16**: drop `.lri` captures (or pull over **adb**), inspect modules, export per-module Adobe **DNG** — full set or **mono only** (A2 / C6) with optional PNG previews and a progress queue.

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

Requires: Rust, Node 20+, Xcode CLT, `adb` on PATH for camera features.

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
| **Rust** | checkout luminat → fmt · clippy · release binary (macOS) |
| **Tauri bundle** | on `v*` tags only |

Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Features

| Action | Result |
| --- | --- |
| Drop `.lri` | Inspect modules / mono tags, queue card |
| **From Light camera** | adb · `/sdcard/DCIM/Camera/*.lri` · pull → queue |
| **Convert** | `light::extract` → `<output>/<stem>/*.dng` |
| Mono only | `A2_mono.dng` / `C6_mono.dng` |
| Mono previews | `mono/A2.png` |
| Reveal | Open output folder in Finder |

Camera pull cache: `~/Library/Caches/lri-drop/camera/`.

## Relation to Luminat app

| | **LRI Drop** (this repo) | **Luminat** (`luminat` / `lumen`) |
| --- | --- | --- |
| Focus | Fast LRI → DNG | Full desktop “own Lumen” |
| Fusion | — | libcp quality render |
| Camera | yes | yes (M2) |

Same `light` library; different product shells.

## License

Same spirit as luminat / open L16 community tooling — isamarin × BLMK.
