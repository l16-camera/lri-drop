# LRI Drop

[![CI](https://github.com/l16-camera/lri-drop/actions/workflows/ci.yml/badge.svg)](https://github.com/l16-camera/lri-drop/actions/workflows/ci.yml)
[![Pages](https://github.com/l16-camera/lri-drop/actions/workflows/pages.yml/badge.svg)](https://github.com/l16-camera/lri-drop/actions/workflows/pages.yml)

**[Live demo / landing →](https://lridrop.isamarin.xyz/)** — interactive UI shell, [circahue](https://github.com/isamarin/circahue) accent dial, **why 16 DNGs** module map, product walkthrough.

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

## Download (photographers)

**[Latest release →](https://github.com/l16-camera/lri-drop/releases/latest)** — zip per OS, no GitHub login required for public assets.

| Platform | Asset |
| --- | --- |
| Mac (Apple Silicon) | `LRI-Drop-macOS-Apple-Silicon.zip` |
| Windows x64 | `LRI-Drop-Windows-x64.zip` |
| Linux x64 | `LRI-Drop-Linux-x64.zip` |

## CI (GitHub Actions)

| Job | What |
| --- | --- |
| **Frontend** | `npm ci` · eslint · vite build · artifact `dist/` |
| **Rust · fmt & clippy** | checkout luminat → fmt · clippy (macOS) |
| **Build** | release binary matrix: **macOS aarch64**, **Windows x64**, **Linux x64** |
| **Publish Release** | on `v*` tags → GitHub Release with named zips + binaries |
| **Tauri bundle** | on `v*` tags: app (macOS) · nsis (Windows) · deb (Linux) |

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

**Why many DNGs?** L16 banks A1–A5 · B1–B5 · C1–C6 — separate sensors/focals, not duplicates. See the [landing module map](https://lridrop.isamarin.xyz/#modules).

Camera pull cache (macOS): `~/Library/Caches/lri-drop/camera/` (platform cache dirs elsewhere).

## Relation to Lightmotiv

| | **LRI Drop** (this repo) | **Lightmotiv** (`lightmotiv` / `lumen`) |
| --- | --- | --- |
| Focus | Fast LRI → DNG | Full desktop “own Lumen” |
| Fusion | — | libcp quality render |
| Camera | yes | yes (M2) |

Same `light` library; different product shells.

## License

LRI Drop's own code — Tauri shell, Svelte interface, DNG export queue, adb
camera pull, landing page under `docs/` — is licensed under either
[Apache-2.0](LICENSE-APACHE) or [MIT](LICENSE-MIT), at your option.

Released binaries also contain the `.lri` parser inherited from
[gennyble/lri-rs](https://github.com/gennyble/lri-rs): `lri-rs` under ISC
(© 2023 gennyble \<gen@nyble.dev\>) and `lri-proto` under MIT (© 2021 Daniel
Lawrence Lu). See [NOTICE](NOTICE).

Contributions are dual licensed the same way unless you say otherwise.
