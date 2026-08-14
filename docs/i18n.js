/**
 * One-URL i18n for the GitHub Pages landing.
 * HTML source stays English (what crawlers index).
 * ja / ru / fr are a client switch — same canonical, no extra SEO URLs.
 */

export const LOCALES = ["en", "ja", "ru", "fr"];

const STORAGE_KEY = "lri-lang";

/** @type {Record<string, Record<string, string>>} */
export const STRINGS = {
  en: {
    metaTitle: "LRI Drop — Light Raw → Adobe DNG",
    metaDesc:
      "Desktop app for Light L16: drop .lri captures, pull from camera over adb, export per-module Adobe DNG — including mono A2/C6.",
    navAria: "Page",
    navOwners: "For owners",
    navDemo: "Demo",
    navModules: "Why 16 DNGs",
    navHow: "How it works",
    navDownload: "Download",
    langAria: "Language",
    hueTitle: "Circadian accent · circahue",
    dispatchAria: "Message for L16 owners",
    dispatchKicker: "For L16 owners",
    dispatchBody:
      "Your <code>/lightcal</code> factory dump is unique to the sensors in this body. The calibration rig is gone. Pull is read-only — no root.",
    dispatchRead: "Read the letter",
    heroEyebrow: "Tauri 2 · Svelte 5 · open L16 tooling",
    heroTitle: "Drop a Light capture.<br /><em>Walk away with DNG.</em>",
    heroLede:
      "LRI Drop is a small desktop converter for <strong>Light L16</strong> <code>.lri</code> files. It inspects modules, pulls shots from the camera over <code>adb</code>, and writes per-module Adobe DNG — full set or mono only (A2 / C6) with optional PNG previews. Brand chrome follows a <a href=\"https://github.com/isamarin/circahue\">circahue</a> circadian accent (same living light idea as Lightmotiv).",
    heroCtaDl: "Download free",
    heroCtaDemo: "Try the UI demo",
    heroMetaFormatL: "Format",
    heroMetaFormat: ".lri → per-module .dng",
    heroMetaCamL: "Camera",
    heroMetaCam: "USB + adb pull",
    heroMetaWhyL: "Why many files",
    heroMetaWhy: "1 LRI = up to 16 sensors",
    letterKicker: "A note to anyone still shooting the L16",
    letterTitle: "For L16 owners",
    letterP1:
      "Your camera holds something no phone will give you: the raw planes of every module that took part in a shot, before any fusion, inside the <code>.lri</code> container. Two of those modules — A2 at 28&nbsp;mm and C6 at 150&nbsp;mm — are panchromatic AR1335 sensors with no colour filter array, which Light never documented anywhere.",
    letterP2:
      "It also holds its own factory calibration in <code>/lightcal</code>: per-module colour under three illuminants, geometry, module coverage, and a hot-pixel map measured on those exact sensors. Nothing can regenerate it — the rig is gone and so is the company. Dumping it is read-only and needs no root:",
    letterCopy: "Copy",
    letterCopied: "Copied",
    letterCopyFail: "Copy failed",
    letterP3:
      "Sharing yours builds a corpus that has never existed. It would answer questions a single unit cannot: whether the panchromatic modules always sit at A2 and C6, how much of the calibration is unit-specific rather than model-wide, and whether the format changed across firmware revisions.",
    letterFoot:
      "If you dump it, <a href=\"https://github.com/l16-camera/lri-drop/issues/new?title=lightcal%20backup\" data-goatcounter-click=\"lightcal-issue\" data-goatcounter-title=\"Open lightcal issue\">open an issue</a> and attach the folder (or a link). One unit is a specimen. Several is a corpus.",
    demoTitle: "Interactive shell",
    demoLede:
      "Same controls as the desktop app — toggles, queue cards, progress. Drag the hour dial to scrub the <strong>circahue</strong> accent through a full day (midnight → zenith → sunset → night).",
    demoAria: "LRI Drop UI demo",
    demoSub: "Light Raw → DNG · drop or from camera",
    demoExports: "Exports",
    dropAria: "Demo drop zone — click to add a sample file",
    dropTitle: "Drop .lri files here",
    dropHintBefore: "or",
    dropAdd: "add sample shot",
    dropHintAfter: "· mono as",
    dropSampleAdded: "Sample added",
    toggleMono: "Mono only (A2 / C6)",
    togglePrev: "Mono PNG previews",
    convert: "Convert",
    converting: "Converting…",
    queueEmpty: "Queue empty — drop files or open camera",
    filesOne: "1 file",
    filesMany: "{n} files",
    statDone: "{n} done",
    statWorking: "working…",
    clearDone: "Clear done",
    chipCamera: "camera",
    modulesReady: "{n} modules ready",
    monoReady: "{n} mono modules ready",
    extractPct: "extract · {n}%",
    openFolder: "{n} DNG{mono} → open",
    revealDemo: "demo — no local folder",
    removeAria: "Remove",
    hueAsideTitle: "CircaHue accent",
    hourScrub: "Hour scrub",
    hourLiveOut: "live",
    hourAria: "Override local hour for accent color",
    useLive: "Use live clock",
    demoStep1: "Scrub the dial — mark, buttons, and drop rings track the hue.",
    demoStep2: "Click the drop zone or “add sample shot”.",
    demoStep3: "Flip <strong>Mono only</strong> / previews, then <strong>Convert</strong>.",
    demoAside:
      "Real conversion needs the Tauri build + <a href=\"https://github.com/l16-camera/lightmotiv\">lightmotiv</a> <code>light</code>. Accent math is <a href=\"https://github.com/isamarin/circahue\">@igrs/circahue</a> (pure TS, zero DOM deps).",
    modulesTitle: "Why so many raw files?",
    modulesLede:
      "One Light L16 shutter press is not one photo — it is a <strong>multi-camera capture</strong> packed into a single <code>.lri</code>. LRI Drop does not “multiply” frames; it <em>unpacks</em> what the hardware already recorded.",
    arrayAria: "L16 module array — which lenses fire at each focal length",
    arrayTitle: "MODULE ARRAY · <b>which lenses fire at each focal length</b>",
    firing: "{n} modules firing",
    firingRef: "{n} modules firing · ref {ref}",
    mmEq: "mm equivalent",
    regimeWide: "wide + mid",
    regimeTele: "mid + tele",
    rowLabel: "Row {id}",
    rowWide: "wide",
    rowMid: "mid",
    rowTele: "tele",
    focalAria: "Focal length — scrub which module banks fire",
    arrayCaption:
      "Measured on a live L16 (61 captures). Below ~70&nbsp;mm the wide row (A) and mid row (B) expose; past it mid hands off to tele (C). Reference module = widest that fired. Each lit cell becomes its own DNG in LRI Drop.",
    modCopyTitle: "Separate frames from separate modules",
    modCopyP:
      "The L16 ships <strong>sixteen optical modules</strong> in three banks (A1–A5 · B1–B5 · C1–C6). A shutter press packs the active set into one <code>.lri</code> — not a stack of JPEGs, and not a fused “final” RAW. LRI Drop unpacks what the hardware already recorded.",
    factCount:
      "<strong>~10–11 DNGs per shot, not always 16</strong> — only modules that fired write sensor data. Scrub the focal dial to see the handoff.",
    factDup:
      "<strong>Not duplicates</strong> — each file is a different viewpoint / focal band / sensor. That is the multi-aperture raw for Lightroom or research.",
    factMono:
      "<strong>Mono plates</strong> — <code>A2</code> and <code>C6</code> are monochrome (dashed cells). Mono-only export keeps <code>A2_mono.dng</code> / <code>C6_mono.dng</code>.",
    arrayCredit:
      "Array UX from the <a href=\"https://claude.ai/code/artifact/6ccaac29-3827-4fd3-979f-86ef9bb263d6\">openfusion artifact</a> · adapted for LRI Drop.",
    howTitle: "From capture to DNG",
    howLede: "Three short paths into the same queue.",
    stepDrop: "Drop files",
    stepDropP:
      "Drag <code>.lri</code> onto the window. Each file is inspected for module count, focal length, and mono cameras before it sits ready in the queue.",
    stepPull: "Pull from Light",
    stepPullP:
      "Connect L16 over USB. LRI Drop lists <code>/sdcard/DCIM/Camera/*.lri</code> via adb, pulls selected shots (with cache), then queues them like local drops.",
    stepConv: "Convert",
    stepConvP:
      "<code>light::extract</code> writes <code>&lt;output&gt;/&lt;stem&gt;/*.dng</code>. Optional mono-only pass keeps A2/C6; PNG previews land under <code>mono/</code>.",
    featTitle: "Built for L16 workflows",
    featLede: "Fast shell around the same library as the fuller Lightmotiv desktop app.",
    feat1t: "Per-module DNG",
    feat1p: "Every optical module becomes its own Adobe DNG for Lightroom, Capture One, or raw pipelines.",
    feat2t: "Mono A2 / C6",
    feat2p: "Export only mono channels as <code>A2_mono.dng</code> / <code>C6_mono.dng</code> with optional PNG previews.",
    feat3t: "Camera queue",
    feat3p: "adb status pill, remote list modal, multi-select pull, progress events while files move.",
    feat4t: "Queue with progress",
    feat4p: "Per-file cards: ready, pulling, running %, done with “open folder”, or error text.",
    feat5t: "Living accent",
    feat5p:
      "UI gold is not a fixed hex — <a href=\"https://github.com/isamarin/circahue\">circahue</a> samples time, season, and latitude into CSS accent vars.",
    feat6t: "Same light crate",
    feat6p: "Parsing and extract come from Lightmotiv’s open <code>light</code> library — not a black-box converter.",
    cmpTitle: "LRI Drop vs Lightmotiv",
    cmpLede: "Same library, different product shells.",
    cmpFocus: "Focus",
    cmpFocusDrop: "Fast LRI → DNG",
    cmpFocusLum: "Full desktop “own Lumen”",
    cmpFusion: "Fusion / render",
    cmpCam: "Camera (adb)",
    cmpCamLum: "Yes (M2)",
    cmpAccent: "Accent",
    cmpAccentLum: "circahue (design origin)",
    cmpBest: "Best for",
    cmpBestDrop: "Batch extract, mono plates",
    cmpBestLum: "Deep L16 studio workflow",
    dlTitle: "Download LRI Drop",
    dlLede: "Free desktop app for photographers. Pick your system, unzip if needed, open — no account, no installer wizard.",
    dlMacMeta: "Apple Silicon (M1 / M2 / M3 / M4)",
    dlMacP:
      "Download the zip, open <strong>LRI-Drop-macOS-Apple-Silicon</strong>. First time: <em>right-click → Open</em> (unsigned build).",
    dlMacBtn: "Download for Mac",
    dlWinMeta: "64-bit PC",
    dlWinP:
      "Download and run <strong>LRI-Drop-Windows-x64.exe</strong>. If SmartScreen warns: <em>More info → Run anyway</em>.",
    dlWinBtn: "Download for Windows",
    dlLinMeta: "x64 · Ubuntu / Debian-class",
    dlLinP:
      "Unzip, then <code>chmod +x LRI-Drop-Linux-x64</code> and run it. Needs WebKitGTK installed.",
    dlLinBtn: "Download for Linux",
    dlNote:
      "All versions, release notes, and raw binaries: <a href=\"https://github.com/l16-camera/lri-drop/releases/latest\" data-goatcounter-click=\"releases-page\" data-goatcounter-title=\"Open Releases\">GitHub Releases</a>. Camera pull from a Light L16 needs <a href=\"https://developer.android.com/tools/releases/platform-tools\">adb</a> on your PATH. Prefer building from source? See setup below.",
    ctaTitle: "Clone, link lightmotiv, run.",
    ctaP: "Rust, Node 20+, platform WebView deps. <code>adb</code> on PATH for camera features.",
    footMuted: "This page is a static demo for GitHub Pages — not the native app binary.",
  },

  ja: {
    metaTitle: "LRI Drop — Light Raw → Adobe DNG",
    metaDesc:
      "Light L16 向けデスクトップアプリ。.lri をドロップ、adb でカメラから取り込み、モジュールごとの Adobe DNG（モノクロ A2 / C6 含む）を書き出します。",
    navAria: "ページ",
    navOwners: "所有者へ",
    navDemo: "デモ",
    navModules: "なぜ16枚のDNG",
    navHow: "使い方",
    navDownload: "ダウンロード",
    langAria: "言語",
    hueTitle: "概日アクセント · circahue",
    dispatchAria: "L16 所有者へのメッセージ",
    dispatchKicker: "L16 所有者へ",
    dispatchBody:
      "<code>/lightcal</code> の工場校正は、その個体のセンサーだけのものです。校正治具はもうありません。読み取り専用の pull で、root は不要です。",
    dispatchRead: "手紙を読む",
    heroEyebrow: "Tauri 2 · Svelte 5 · 開かれた L16 ツール",
    heroTitle: "Light の撮影をドロップ。<br /><em>DNG を持って帰る。</em>",
    heroLede:
      "LRI Drop は <strong>Light L16</strong> の <code>.lri</code> 向けの小さなデスクトップ変換アプリです。モジュールを検査し、<code>adb</code> でカメラから取り込み、モジュールごとの Adobe DNG を書き出します。全セット、またはモノクロのみ（A2 / C6）。任意で PNG プレビュー。ブランド色は <a href=\"https://github.com/isamarin/circahue\">circahue</a> の概日アクセントです（Lightmotiv と同じ「生きた光」）。",
    heroCtaDl: "無料で入手",
    heroCtaDemo: "UI デモを試す",
    heroMetaFormatL: "形式",
    heroMetaFormat: ".lri → モジュールごと .dng",
    heroMetaCamL: "カメラ",
    heroMetaCam: "USB + adb pull",
    heroMetaWhyL: "ファイルが多い理由",
    heroMetaWhy: "1つの LRI = 最大16センサー",
    letterKicker: "まだ L16 で撮っている人へ",
    letterTitle: "L16 所有者へ",
    letterP1:
      "このカメラには、どの電話も渡さないものが入っています。融合前、シャッターに参加した各モジュールの生の平面が <code>.lri</code> の中にあります。そのうち A2（28&nbsp;mm）と C6（150&nbsp;mm）はカラーフィルタのないパンクロ AR1335 で、Light はどこにも書いていませんでした。",
    letterP2:
      "個体ごとの工場校正も <code>/lightcal</code> に残っています。3種の光源でのモジュール色、幾何、カバー範囲、そのセンサーで測ったホットピクセルマップ。作り直せません。治具も会社ももうない。ダンプは読み取り専用で、root は不要です:",
    letterCopy: "コピー",
    letterCopied: "コピーした",
    letterCopyFail: "失敗",
    letterP3:
      "共有すれば、これまで存在しなかったコーパスになります。1台では答えられない問いに手が届きます。パンクロはいつも A2 と C6 か、校正のどこまでが個体差か、ファームで形式が変わったか。",
    letterFoot:
      "ダンプしたら <a href=\"https://github.com/l16-camera/lri-drop/issues/new?title=lightcal%20backup\" data-goatcounter-click=\"lightcal-issue\" data-goatcounter-title=\"Open lightcal issue\">issue を開いて</a>フォルダ（またはリンク）を付けてください。1台は標本。数台でコーパスです。",
    demoTitle: "インタラクティブなシェル",
    demoLede:
      "デスクトップ版と同じ操作 — トグル、キュー、進捗。<strong>circahue</strong> のアクセントを時間ダイヤルで一日分こすれます（深夜 → 南中 → 日没 → 夜）。",
    demoAria: "LRI Drop UI デモ",
    demoSub: "Light Raw → DNG · ドロップまたはカメラから",
    demoExports: "書き出し",
    dropAria: "デモのドロップ — クリックでサンプル追加",
    dropTitle: ".lri をここにドロップ",
    dropHintBefore: "または",
    dropAdd: "サンプルを追加",
    dropHintAfter: "· モノクロは",
    dropSampleAdded: "サンプルを追加した",
    toggleMono: "モノクロのみ (A2 / C6)",
    togglePrev: "モノクロ PNG プレビュー",
    convert: "変換",
    converting: "変換中…",
    queueEmpty: "キューは空 — ファイルをドロップするかカメラを開く",
    filesOne: "1 ファイル",
    filesMany: "{n} ファイル",
    statDone: "{n} 完了",
    statWorking: "処理中…",
    clearDone: "完了を消す",
    chipCamera: "カメラ",
    modulesReady: "{n} モジュール準備完了",
    monoReady: "モノクロ {n} 準備完了",
    extractPct: "extract · {n}%",
    openFolder: "{n} DNG{mono} → 開く",
    revealDemo: "デモ — ローカルフォルダなし",
    removeAria: "削除",
    hueAsideTitle: "CircaHue アクセント",
    hourScrub: "時刻スクラブ",
    hourLiveOut: "live",
    hourAria: "アクセント色の時刻を上書き",
    useLive: "実際の時計を使う",
    demoStep1: "ダイヤルを動かす — マーク、ボタン、ドロップの輪が色に追従します。",
    demoStep2: "ドロップゾーンか「サンプルを追加」をクリック。",
    demoStep3: "<strong>モノクロのみ</strong> / プレビューを切り替えて <strong>変換</strong>。",
    demoAside:
      "本物の変換には Tauri ビルドと <a href=\"https://github.com/l16-camera/lightmotiv\">lightmotiv</a> の <code>light</code> が必要です。色の計算は <a href=\"https://github.com/isamarin/circahue\">@igrs/circahue</a>（純 TS、DOM 依存なし）。",
    modulesTitle: "なぜ RAW がこんなに多い？",
    modulesLede:
      "Light L16 のシャッター一回は一枚の写真ではありません。<code>.lri</code> に詰まった <strong>マルチカメラ撮影</strong> です。LRI Drop はフレームを「増やして」いません。ハードウェアが既に撮ったものを <em>ほどきます</em>。",
    arrayAria: "L16 モジュール配列 — 焦点距離ごとにどのレンズが切れるか",
    arrayTitle: "MODULE ARRAY · <b>焦点距離ごとに切れるレンズ</b>",
    firing: "{n} モジュール発光",
    firingRef: "{n} モジュール発光 · 基準 {ref}",
    mmEq: "mm 相当",
    regimeWide: "広角 + 中間",
    regimeTele: "中間 + 望遠",
    rowLabel: "列 {id}",
    rowWide: "広角",
    rowMid: "中間",
    rowTele: "望遠",
    focalAria: "焦点距離 — どのバンクが切れるか",
    arrayCaption:
      "実機 L16（61枚）で計測。約70&nbsp;mm未満は広角列 (A) と中間列 (B)。それを超えると中間から望遠 (C) へ。基準モジュール = 切れたうち最も広いもの。点灯したセルが LRI Drop ではそれぞれ DNG になります。",
    modCopyTitle: "モジュールごとに別フレーム",
    modCopyP:
      "L16 は三つのバンクに <strong>16の光学モジュール</strong>（A1–A5 · B1–B5 · C1–C6）。シャッターは動いた組を一つの <code>.lri</code> に詰める。JPEG の山でも、融合済みの「完成 RAW」でもない。LRI Drop はハードウェアが撮ったものをほどきます。",
    factCount:
      "<strong>1枚あたりだいたい 10–11 DNG。いつも16枚ではない</strong> — 切れたモジュールだけがセンサーデータを書く。焦点ダイヤルで受け渡しが見えます。",
    factDup:
      "<strong>複製ではない</strong> — それぞれ視点 / 焦点帯 / センサーが違う。Lightroom や研究向けのマルチ絞り RAW です。",
    factMono:
      "<strong>モノクロ板</strong> — <code>A2</code> と <code>C6</code> はモノクロ（破線のセル）。モノクロのみ書き出しは <code>A2_mono.dng</code> / <code>C6_mono.dng</code>。",
    arrayCredit:
      "配列 UX は <a href=\"https://claude.ai/code/artifact/6ccaac29-3827-4fd3-979f-86ef9bb263d6\">openfusion artifact</a> · LRI Drop 向けに改変。",
    howTitle: "撮影から DNG まで",
    howLede: "同じキューに入る三つの短い道。",
    stepDrop: "ファイルをドロップ",
    stepDropP:
      "ウィンドウに <code>.lri</code> をドラッグ。モジュール数、焦点距離、モノクロの有無を見てからキューに並びます。",
    stepPull: "Light から取り込む",
    stepPullP:
      "USB で L16 を接続。LRI Drop は adb で <code>/sdcard/DCIM/Camera/*.lri</code> を列挙し、選んだショットを（キャッシュ付きで）取り込み、ローカルと同じキューに載せます。",
    stepConv: "変換",
    stepConvP:
      "<code>light::extract</code> が <code>&lt;output&gt;/&lt;stem&gt;/*.dng</code> を書きます。モノクロのみなら A2/C6。PNG プレビューは <code>mono/</code> へ。",
    featTitle: "L16 の作業向け",
    featLede: "より大きな Lightmotiv デスクトップと同じライブラリの、速い殻。",
    feat1t: "モジュールごと DNG",
    feat1p: "光学モジュールごとに Adobe DNG。Lightroom、Capture One、RAW パイプラインへ。",
    feat2t: "モノクロ A2 / C6",
    feat2p: "モノクロだけ <code>A2_mono.dng</code> / <code>C6_mono.dng</code>。任意で PNG プレビュー。",
    feat3t: "カメラキュー",
    feat3p: "adb 状態、リモート一覧、複数選択 pull、転送中の進捗。",
    feat4t: "進捗つきキュー",
    feat4p: "ファイルごとのカード: 準備、取り込み、%、完了して「フォルダを開く」、またはエラー。",
    feat5t: "生きたアクセント",
    feat5p:
      "UI の金は固定 hex ではない — <a href=\"https://github.com/isamarin/circahue\">circahue</a> が時刻・季節・緯度を CSS 変数にする。",
    feat6t: "同じ light crate",
    feat6p: "解析と書き出しは Lightmotiv の公開 <code>light</code> — 黒箱のコンバータではない。",
    cmpTitle: "LRI Drop と Lightmotiv",
    cmpLede: "同じライブラリ、違う殻。",
    cmpFocus: "焦点",
    cmpFocusDrop: "速い LRI → DNG",
    cmpFocusLum: "フルデスクトップ「own Lumen」",
    cmpFusion: "融合 / レンダー",
    cmpCam: "カメラ (adb)",
    cmpCamLum: "あり (M2)",
    cmpAccent: "アクセント",
    cmpAccentLum: "circahue（デザインの起点）",
    cmpBest: "向いている人",
    cmpBestDrop: "一括抽出、モノクロ板",
    cmpBestLum: "深い L16 スタジオ作業",
    dlTitle: "LRI Drop を入手",
    dlLede: "写真家向けの無料デスクトップアプリ。自分の OS を選んで、必要なら解凍して開く。アカウントもウィザードもなし。",
    dlMacMeta: "Apple Silicon (M1 / M2 / M3 / M4)",
    dlMacP:
      "zip を開き <strong>LRI-Drop-macOS-Apple-Silicon</strong>。初回は <em>右クリック → 開く</em>（未署名ビルド）。",
    dlMacBtn: "Mac 用を入手",
    dlWinMeta: "64-bit PC",
    dlWinP:
      "<strong>LRI-Drop-Windows-x64.exe</strong> を実行。SmartScreen が出たら <em>詳細情報 → 実行</em>。",
    dlWinBtn: "Windows 用を入手",
    dlLinMeta: "x64 · Ubuntu / Debian 系",
    dlLinP:
      "解凍して <code>chmod +x LRI-Drop-Linux-x64</code> して実行。WebKitGTK が必要。",
    dlLinBtn: "Linux 用を入手",
    dlNote:
      "全バージョンとリリースノート: <a href=\"https://github.com/l16-camera/lri-drop/releases/latest\" data-goatcounter-click=\"releases-page\" data-goatcounter-title=\"Open Releases\">GitHub Releases</a>。L16 からの取り込みには PATH 上の <a href=\"https://developer.android.com/tools/releases/platform-tools\">adb</a>。ソースからビルドする場合は下を参照。",
    ctaTitle: "clone、lightmotiv をリンク、実行。",
    ctaP: "Rust、Node 20+、各 OS の WebView。<code>adb</code> はカメラ機能用。",
    footMuted: "これは GitHub Pages の静的デモであり、ネイティブアプリ本体ではありません。",
  },

  ru: {
    metaTitle: "LRI Drop — Light Raw → Adobe DNG",
    metaDesc:
      "Десктоп для Light L16: бросайте .lri, забирайте с камеры по adb, пишите Adobe DNG с каждого модуля — включая моно A2/C6.",
    navAria: "Страница",
    navOwners: "Владельцам",
    navDemo: "Демо",
    navModules: "Зачем 16 DNG",
    navHow: "Как это работает",
    navDownload: "Скачать",
    langAria: "Язык",
    hueTitle: "Циркадный акцент · circahue",
    dispatchAria: "Послание владельцам L16",
    dispatchKicker: "Владельцам L16",
    dispatchBody:
      "Заводской дамп <code>/lightcal</code> уникален для сенсоров именно этого корпуса. Станок калибровки исчез. Pull только на чтение, root не нужен.",
    dispatchRead: "Читать письмо",
    heroEyebrow: "Tauri 2 · Svelte 5 · открытый софт для L16",
    heroTitle: "Бросьте снимок Light.<br /><em>Уходите с DNG.</em>",
    heroLede:
      "LRI Drop — маленький десктоп-конвертер <code>.lri</code> для <strong>Light L16</strong>. Смотрит модули, забирает кадры с камеры по <code>adb</code>, пишет Adobe DNG с каждого модуля — полный набор или только моно (A2 / C6), по желанию PNG-превью. Цвет оболочки — циркадный акцент <a href=\"https://github.com/isamarin/circahue\">circahue</a> (та же живая световая идея, что у Lightmotiv).",
    heroCtaDl: "Скачать бесплатно",
    heroCtaDemo: "Демо интерфейса",
    heroMetaFormatL: "Формат",
    heroMetaFormat: ".lri → .dng с модуля",
    heroMetaCamL: "Камера",
    heroMetaCam: "USB + adb pull",
    heroMetaWhyL: "Почему много файлов",
    heroMetaWhy: "1 LRI = до 16 сенсоров",
    letterKicker: "Тем, кто всё ещё снимает на L16",
    letterTitle: "Владельцам L16",
    letterP1:
      "В камере лежит то, чего не даст ни один телефон: сырые плоскости каждого модуля, участвовавшего в кадре, до любой склейки, внутри контейнера <code>.lri</code>. Два из них — A2 на 28&nbsp;мм и C6 на 150&nbsp;мм — панхроматические AR1335 без массива цветных фильтров. Light этого нигде не документировала.",
    letterP2:
      "Там же своя заводская калибровка в <code>/lightcal</code>: цвет каждого модуля при трёх источниках, геометрия, покрытие, карта горячих пикселей, снятая с этих сенсоров. Её нельзя воспроизвести — станка нет, компании нет. Дамп только на чтение, root не нужен:",
    letterCopy: "Копировать",
    letterCopied: "Скопировано",
    letterCopyFail: "Не вышло",
    letterP3:
      "Если сложить ваши дампы, получится корпус, которого никогда не было. Он ответит на вопросы, которые одна тушка закрыть не может: всегда ли панхром на A2 и C6, что в калибровке индивидуально, а что общее для модели, менялся ли формат по прошивкам.",
    letterFoot:
      "Сняли дамп — <a href=\"https://github.com/l16-camera/lri-drop/issues/new?title=lightcal%20backup\" data-goatcounter-click=\"lightcal-issue\" data-goatcounter-title=\"Open lightcal issue\">откройте issue</a> и приложите папку (или ссылку). Одна тушка — экземпляр. Несколько — корпус.",
    demoTitle: "Интерактивная оболочка",
    demoLede:
      "Те же органы, что в десктопе — тумблеры, карточки очереди, прогресс. Крутите диск часа: акцент <strong>circahue</strong> проходит целые сутки (полночь → зенит → закат → ночь).",
    demoAria: "Демо интерфейса LRI Drop",
    demoSub: "Light Raw → DNG · с диска или с камеры",
    demoExports: "Экспорт",
    dropAria: "Демо-зона — нажмите, чтобы добавить образец",
    dropTitle: "Бросьте сюда .lri",
    dropHintBefore: "или",
    dropAdd: "добавить образец",
    dropHintAfter: "· моно как",
    dropSampleAdded: "Образец добавлен",
    toggleMono: "Только моно (A2 / C6)",
    togglePrev: "PNG-превью моно",
    convert: "Конвертировать",
    converting: "Конвертация…",
    queueEmpty: "Очередь пуста — бросьте файлы или откройте камеру",
    filesOne: "1 файл",
    filesMany: "{n} файлов",
    statDone: "{n} готово",
    statWorking: "идёт…",
    clearDone: "Убрать готовое",
    chipCamera: "камера",
    modulesReady: "{n} модулей готовы",
    monoReady: "{n} моно готовы",
    extractPct: "extract · {n}%",
    openFolder: "{n} DNG{mono} → открыть",
    revealDemo: "демо — локальной папки нет",
    removeAria: "Убрать",
    hueAsideTitle: "Акцент CircaHue",
    hourScrub: "Час",
    hourLiveOut: "live",
    hourAria: "Подменить местный час для цвета акцента",
    useLive: "Живые часы",
    demoStep1: "Крутите диск — марка, кнопки и кольца дропа идут за цветом.",
    demoStep2: "Клик по зоне или «добавить образец».",
    demoStep3: "Переключите <strong>только моно</strong> / превью, затем <strong>Конвертировать</strong>.",
    demoAside:
      "Настоящая конвертация — сборка Tauri + <a href=\"https://github.com/l16-camera/lightmotiv\">lightmotiv</a> <code>light</code>. Математика акцента — <a href=\"https://github.com/isamarin/circahue\">@igrs/circahue</a> (чистый TS, без DOM).",
    modulesTitle: "Почему столько сырых файлов?",
    modulesLede:
      "Одно нажатие затвора Light L16 — это не один снимок, а <strong>съёмка несколькими камерами</strong> в одном <code>.lri</code>. LRI Drop не «размножает» кадры; он <em>распаковывает</em> то, что железо уже записало.",
    arrayAria: "Массив модулей L16 — какие линзы стреляют на каждом фокусе",
    arrayTitle: "MODULE ARRAY · <b>какие линзы стреляют на каждом фокусе</b>",
    firing: "{n} модулей стреляют",
    firingRef: "{n} модулей стреляют · ref {ref}",
    mmEq: "мм эквивалент",
    regimeWide: "ширик + середина",
    regimeTele: "середина + теле",
    rowLabel: "Ряд {id}",
    rowWide: "ширик",
    rowMid: "середина",
    rowTele: "теле",
    focalAria: "Фокус — какие банки модулей стреляют",
    arrayCaption:
      "Снято с живой L16 (61 кадр). Ниже ~70&nbsp;мм светятся широкий ряд (A) и средний (B); дальше середина отдаёт теле (C). Опорный модуль = самый широкий из стрелявших. Каждая зажжённая клетка в LRI Drop становится своим DNG.",
    modCopyTitle: "Отдельные кадры с отдельных модулей",
    modCopyP:
      "У L16 <strong>шестнадцать оптических модулей</strong> в трёх банках (A1–A5 · B1–B5 · C1–C6). Затвор пакует активный набор в один <code>.lri</code> — не стопку JPEG и не слитый «итоговый» RAW. LRI Drop распаковывает то, что железо уже записало.",
    factCount:
      "<strong>~10–11 DNG на кадр, не всегда 16</strong> — данные пишут только модули, которые выстрелили. Крутите фокус — видно передачу.",
    factDup:
      "<strong>Не дубликаты</strong> — у каждого файла своя точка / полоса фокуса / сенсор. Это мультиапертурный raw для Lightroom или исследования.",
    factMono:
      "<strong>Монопластины</strong> — <code>A2</code> и <code>C6</code> монохром (пунктир). Экспорт только моно даёт <code>A2_mono.dng</code> / <code>C6_mono.dng</code>.",
    arrayCredit:
      "Массив — из <a href=\"https://claude.ai/code/artifact/6ccaac29-3827-4fd3-979f-86ef9bb263d6\">openfusion artifact</a> · адаптирован для LRI Drop.",
    howTitle: "От съёмки до DNG",
    howLede: "Три коротких пути в одну очередь.",
    stepDrop: "Бросить файлы",
    stepDropP:
      "Перетащите <code>.lri</code> на окно. Файл смотрит число модулей, фокус и монокамеры — и садится в очередь.",
    stepPull: "Забрать с Light",
    stepPullP:
      "Подключите L16 по USB. LRI Drop через adb смотрит <code>/sdcard/DCIM/Camera/*.lri</code>, тянет выбранные кадры (с кэшем) и ставит в ту же очередь.",
    stepConv: "Конвертировать",
    stepConvP:
      "<code>light::extract</code> пишет <code>&lt;output&gt;/&lt;stem&gt;/*.dng</code>. Опция «только моно» оставляет A2/C6; PNG-превью — в <code>mono/</code>.",
    featTitle: "Под работу с L16",
    featLede: "Быстрая оболочка вокруг той же библиотеки, что полный Lightmotiv.",
    feat1t: "DNG с модуля",
    feat1p: "Каждый оптический модуль — свой Adobe DNG для Lightroom, Capture One или сырого пайплайна.",
    feat2t: "Моно A2 / C6",
    feat2p: "Только моноканалы: <code>A2_mono.dng</code> / <code>C6_mono.dng</code>, по желанию PNG.",
    feat3t: "Очередь с камеры",
    feat3p: "Индикатор adb, список на камере, множественный pull, прогресс пока файлы едут.",
    feat4t: "Очередь с прогрессом",
    feat4p: "Карточка на файл: готов, тянется, %, готово с «открыть папку» или текст ошибки.",
    feat5t: "Живой акцент",
    feat5p:
      "Золото интерфейса — не фиксированный hex: <a href=\"https://github.com/isamarin/circahue\">circahue</a> берёт время, сезон и широту в CSS-переменные.",
    feat6t: "Тот же crate light",
    feat6p: "Разбор и выгрузка — из открытой библиотеки <code>light</code> в lightmotiv, не чёрный ящик.",
    cmpTitle: "LRI Drop и Lightmotiv",
    cmpLede: "Одна библиотека, разные оболочки.",
    cmpFocus: "Фокус",
    cmpFocusDrop: "Быстрый LRI → DNG",
    cmpFocusLum: "Полный десктоп «own Lumen»",
    cmpFusion: "Склейка / рендер",
    cmpCam: "Камера (adb)",
    cmpCamLum: "Да (M2)",
    cmpAccent: "Акцент",
    cmpAccentLum: "circahue (откуда дизайн)",
    cmpBest: "Для кого",
    cmpBestDrop: "Пакетная выгрузка, монопластины",
    cmpBestLum: "Глубокий студийный L16",
    dlTitle: "Скачать LRI Drop",
    dlLede: "Бесплатный десктоп для фотографов. Выберите систему, при необходимости распакуйте, откройте — без аккаунта и мастера установки.",
    dlMacMeta: "Apple Silicon (M1 / M2 / M3 / M4)",
    dlMacP:
      "Скачайте zip, откройте <strong>LRI-Drop-macOS-Apple-Silicon</strong>. Первый раз: <em>правый клик → Открыть</em> (сборка без подписи).",
    dlMacBtn: "Скачать для Mac",
    dlWinMeta: "64-bit PC",
    dlWinP:
      "Скачайте и запустите <strong>LRI-Drop-Windows-x64.exe</strong>. Если ругается SmartScreen: <em>Подробнее → Выполнить</em>.",
    dlWinBtn: "Скачать для Windows",
    dlLinMeta: "x64 · Ubuntu / Debian",
    dlLinP:
      "Распакуйте, затем <code>chmod +x LRI-Drop-Linux-x64</code> и запустите. Нужен WebKitGTK.",
    dlLinBtn: "Скачать для Linux",
    dlNote:
      "Все версии и заметки: <a href=\"https://github.com/l16-camera/lri-drop/releases/latest\" data-goatcounter-click=\"releases-page\" data-goatcounter-title=\"Open Releases\">GitHub Releases</a>. Съём с Light L16 требует <a href=\"https://developer.android.com/tools/releases/platform-tools\">adb</a> в PATH. Собирать из исходников? См. ниже.",
    ctaTitle: "Clone, линк lightmotiv, запуск.",
    ctaP: "Rust, Node 20+, WebView платформы. <code>adb</code> — для камеры.",
    footMuted: "Это статическое демо на GitHub Pages, не сам нативный бинарник.",
  },

  fr: {
    metaTitle: "LRI Drop — Light Raw → Adobe DNG",
    metaDesc:
      "App bureau pour Light L16 : déposez des .lri, tirez depuis l’appareil en adb, exportez un Adobe DNG par module — y compris le mono A2/C6.",
    navAria: "Page",
    navOwners: "Aux propriétaires",
    navDemo: "Démo",
    navModules: "Pourquoi 16 DNG",
    navHow: "Comment ça marche",
    navDownload: "Télécharger",
    langAria: "Langue",
    hueTitle: "Accent circadien · circahue",
    dispatchAria: "Message aux propriétaires L16",
    dispatchKicker: "Aux propriétaires L16",
    dispatchBody:
      "Le dump d’usine <code>/lightcal</code> est unique aux capteurs de <em>ce</em> boîtier. Le banc de calib n’existe plus. Le pull est en lecture seule — pas besoin de root.",
    dispatchRead: "Lire la lettre",
    heroEyebrow: "Tauri 2 · Svelte 5 · outillage L16 ouvert",
    heroTitle: "Déposez une prise Light.<br /><em>Repartez avec du DNG.</em>",
    heroLede:
      "LRI Drop est un petit convertisseur bureau pour les fichiers <code>.lri</code> du <strong>Light L16</strong>. Il inspecte les modules, tire les vues depuis l’appareil en <code>adb</code>, et écrit un Adobe DNG par module — jeu complet ou mono seulement (A2 / C6), aperçus PNG en option. L’accent de marque suit <a href=\"https://github.com/isamarin/circahue\">circahue</a> (la même idée de lumière vivante que Lightmotiv).",
    heroCtaDl: "Télécharger gratuitement",
    heroCtaDemo: "Essayer la démo",
    heroMetaFormatL: "Format",
    heroMetaFormat: ".lri → .dng par module",
    heroMetaCamL: "Appareil",
    heroMetaCam: "USB + adb pull",
    heroMetaWhyL: "Pourquoi tant de fichiers",
    heroMetaWhy: "1 LRI = jusqu’à 16 capteurs",
    letterKicker: "À celles et ceux qui shootent encore au L16",
    letterTitle: "Aux propriétaires L16",
    letterP1:
      "Votre appareil garde ce qu’aucun téléphone ne donnera : les plans bruts de chaque module qui a pris part à la vue, avant toute fusion, dans le conteneur <code>.lri</code>. Deux de ces modules — A2 à 28&nbsp;mm et C6 à 150&nbsp;mm — sont des AR1335 panchromatiques sans matrice de Bayer. Light ne l’a documenté nulle part.",
    letterP2:
      "Il garde aussi sa calib d’usine dans <code>/lightcal</code> : couleur par module sous trois illuminants, géométrie, couverture, carte de pixels chauds mesurée sur <em>ces</em> capteurs. Rien ne peut la régénérer — le banc a disparu, la boîte aussi. Le dump est en lecture seule, sans root :",
    letterCopy: "Copier",
    letterCopied: "Copié",
    letterCopyFail: "Échec",
    letterP3:
      "Partager le vôtre construit un corpus qui n’a jamais existé. Il répondrait à des questions qu’un seul boîtier ne peut pas : les panchros sont-ils toujours en A2 et C6, quelle part de la calib est propre à l’exemplaire plutôt qu’au modèle, le format a-t-il bougé selon les firmwares.",
    letterFoot:
      "Si vous dumpez, <a href=\"https://github.com/l16-camera/lri-drop/issues/new?title=lightcal%20backup\" data-goatcounter-click=\"lightcal-issue\" data-goatcounter-title=\"Open lightcal issue\">ouvrez une issue</a> et joignez le dossier (ou un lien). Un boîtier est un spécimen. Plusieurs, un corpus.",
    demoTitle: "Coquille interactive",
    demoLede:
      "Les mêmes commandes que l’app bureau — bascules, cartes de file, progression. Glissez le cadran d’heure pour faire passer l’accent <strong>circahue</strong> sur une journée (minuit → zénith → coucher → nuit).",
    demoAria: "Démo UI LRI Drop",
    demoSub: "Light Raw → DNG · dépôt ou depuis l’appareil",
    demoExports: "Exports",
    dropAria: "Zone de dépôt démo — cliquez pour ajouter un échantillon",
    dropTitle: "Déposez les .lri ici",
    dropHintBefore: "ou",
    dropAdd: "ajouter un échantillon",
    dropHintAfter: "· mono en",
    dropSampleAdded: "Échantillon ajouté",
    toggleMono: "Mono seulement (A2 / C6)",
    togglePrev: "Aperçus PNG mono",
    convert: "Convertir",
    converting: "Conversion…",
    queueEmpty: "File vide — déposez des fichiers ou ouvrez l’appareil",
    filesOne: "1 fichier",
    filesMany: "{n} fichiers",
    statDone: "{n} faits",
    statWorking: "en cours…",
    clearDone: "Retirer les faits",
    chipCamera: "appareil",
    modulesReady: "{n} modules prêts",
    monoReady: "{n} mono prêts",
    extractPct: "extract · {n}%",
    openFolder: "{n} DNG{mono} → ouvrir",
    revealDemo: "démo — pas de dossier local",
    removeAria: "Retirer",
    hueAsideTitle: "Accent CircaHue",
    hourScrub: "Heure",
    hourLiveOut: "live",
    hourAria: "Forcer l’heure locale pour la couleur d’accent",
    useLive: "Horloge réelle",
    demoStep1: "Tournez le cadran — marque, boutons et anneaux suivent la teinte.",
    demoStep2: "Cliquez la zone ou « ajouter un échantillon ».",
    demoStep3: "Basculez <strong>Mono seulement</strong> / aperçus, puis <strong>Convertir</strong>.",
    demoAside:
      "La vraie conversion demande le build Tauri + <a href=\"https://github.com/l16-camera/lightmotiv\">lightmotiv</a> <code>light</code>. Le calcul d’accent est <a href=\"https://github.com/isamarin/circahue\">@igrs/circahue</a> (TS pur, zéro DOM).",
    modulesTitle: "Pourquoi autant de fichiers raw ?",
    modulesLede:
      "Un déclenchement Light L16 n’est pas une photo — c’est une <strong>prise multi-caméras</strong> dans un seul <code>.lri</code>. LRI Drop ne « multiplie » pas les vues ; il <em>dépaquette</em> ce que le matériel a déjà enregistré.",
    arrayAria: "Matrice de modules L16 — quelles optiques tirent à chaque focale",
    arrayTitle: "MODULE ARRAY · <b>quelles optiques tirent à chaque focale</b>",
    firing: "{n} modules tirent",
    firingRef: "{n} modules tirent · réf. {ref}",
    mmEq: "mm équivalent",
    regimeWide: "grand-angle + milieu",
    regimeTele: "milieu + télé",
    rowLabel: "Rangée {id}",
    rowWide: "grand-angle",
    rowMid: "milieu",
    rowTele: "télé",
    focalAria: "Focale — quelles banques de modules tirent",
    arrayCaption:
      "Mesuré sur un L16 réel (61 prises). Sous ~70&nbsp;mm, les rangées grand-angle (A) et milieu (B) exposent ; au-delà, le milieu passe au télé (C). Module de référence = le plus large qui a tiré. Chaque cellule allumée devient son propre DNG dans LRI Drop.",
    modCopyTitle: "Des vues séparées, des modules séparés",
    modCopyP:
      "Le L16 embarque <strong>seize modules optiques</strong> en trois banques (A1–A5 · B1–B5 · C1–C6). Un déclenchement emballe l’ensemble actif dans un <code>.lri</code> — pas une pile de JPEG, pas un RAW « final » fusionné. LRI Drop dépaquette ce que le matériel a déjà enregistré.",
    factCount:
      "<strong>~10–11 DNG par vue, pas toujours 16</strong> — seuls les modules qui ont tiré écrivent des données. Le cadran de focale montre le passage de relais.",
    factDup:
      "<strong>Pas des doublons</strong> — chaque fichier est un autre point de vue / bande focale / capteur. C’est le raw multi-ouverture pour Lightroom ou la recherche.",
    factMono:
      "<strong>Plaques mono</strong> — <code>A2</code> et <code>C6</code> sont monochromes (cellules en pointillés). L’export mono seul garde <code>A2_mono.dng</code> / <code>C6_mono.dng</code>.",
    arrayCredit:
      "UX de la matrice : <a href=\"https://claude.ai/code/artifact/6ccaac29-3827-4fd3-979f-86ef9bb263d6\">openfusion artifact</a> · adapté pour LRI Drop.",
    howTitle: "De la prise au DNG",
    howLede: "Trois chemins courts vers la même file.",
    stepDrop: "Déposer des fichiers",
    stepDropP:
      "Glissez des <code>.lri</code> sur la fenêtre. Chaque fichier est inspecté (modules, focale, monos) avant de s’asseoir dans la file.",
    stepPull: "Tirer depuis le Light",
    stepPullP:
      "Branchez le L16 en USB. LRI Drop liste <code>/sdcard/DCIM/Camera/*.lri</code> via adb, tire les vues choisies (avec cache), puis les enfile comme un dépôt local.",
    stepConv: "Convertir",
    stepConvP:
      "<code>light::extract</code> écrit <code>&lt;output&gt;/&lt;stem&gt;/*.dng</code>. L’option mono seul garde A2/C6 ; les aperçus PNG vont sous <code>mono/</code>.",
    featTitle: "Fait pour les flux L16",
    featLede: "Coquille rapide autour de la même bibliothèque que Lightmotiv bureau.",
    feat1t: "DNG par module",
    feat1p: "Chaque module optique devient son Adobe DNG pour Lightroom, Capture One ou un pipeline raw.",
    feat2t: "Mono A2 / C6",
    feat2p: "N’exporter que les canaux mono en <code>A2_mono.dng</code> / <code>C6_mono.dng</code>, aperçus PNG en option.",
    feat3t: "File caméra",
    feat3p: "Pastille adb, liste distante, pull multi-sélection, progression pendant le transfert.",
    feat4t: "File avec progression",
    feat4p: "Une carte par fichier : prêt, en cours, %, terminé avec « ouvrir le dossier », ou le texte d’erreur.",
    feat5t: "Accent vivant",
    feat5p:
      "L’or de l’UI n’est pas un hex fixe — <a href=\"https://github.com/isamarin/circahue\">circahue</a> échantillonne l’heure, la saison et la latitude en variables CSS.",
    feat6t: "Le même crate light",
    feat6p: "Analyse et extract viennent de la bibliothèque ouverte <code>light</code> de Lightmotiv — pas une boîte noire.",
    cmpTitle: "LRI Drop vs Lightmotiv",
    cmpLede: "Même bibliothèque, coquilles différentes.",
    cmpFocus: "Focus",
    cmpFocusDrop: "LRI → DNG rapide",
    cmpFocusLum: "Bureau complet « own Lumen »",
    cmpFusion: "Fusion / rendu",
    cmpCam: "Appareil (adb)",
    cmpCamLum: "Oui (M2)",
    cmpAccent: "Accent",
    cmpAccentLum: "circahue (origine du design)",
    cmpBest: "Idéal pour",
    cmpBestDrop: "Extract par lots, plaques mono",
    cmpBestLum: "Studio L16 en profondeur",
    dlTitle: "Télécharger LRI Drop",
    dlLede: "App bureau gratuite pour photographes. Choisissez le système, dézippez si besoin, ouvrez — pas de compte, pas d’assistant d’install.",
    dlMacMeta: "Apple Silicon (M1 / M2 / M3 / M4)",
    dlMacP:
      "Téléchargez le zip, ouvrez <strong>LRI-Drop-macOS-Apple-Silicon</strong>. La première fois : <em>clic droit → Ouvrir</em> (build non signé).",
    dlMacBtn: "Télécharger pour Mac",
    dlWinMeta: "PC 64 bits",
    dlWinP:
      "Téléchargez et lancez <strong>LRI-Drop-Windows-x64.exe</strong>. Si SmartScreen râle : <em>Plus d’infos → Exécuter quand même</em>.",
    dlWinBtn: "Télécharger pour Windows",
    dlLinMeta: "x64 · Ubuntu / Debian",
    dlLinP:
      "Dézippez, puis <code>chmod +x LRI-Drop-Linux-x64</code> et lancez. Il faut WebKitGTK.",
    dlLinBtn: "Télécharger pour Linux",
    dlNote:
      "Toutes les versions et notes : <a href=\"https://github.com/l16-camera/lri-drop/releases/latest\" data-goatcounter-click=\"releases-page\" data-goatcounter-title=\"Open Releases\">GitHub Releases</a>. Le pull depuis un L16 demande <a href=\"https://developer.android.com/tools/releases/platform-tools\">adb</a> dans le PATH. Compiler depuis les sources ? Voir plus bas.",
    ctaTitle: "Clone, lier lightmotiv, lancer.",
    ctaP: "Rust, Node 20+, WebView de la plateforme. <code>adb</code> pour la caméra.",
    footMuted: "Cette page est une démo statique GitHub Pages — pas le binaire natif.",
  },
};

/** @type {string} */
let current = "en";

const listeners = new Set();

export function locale() {
  return current;
}

/**
 * @param {string} key
 * @param {Record<string, string | number>} [vars]
 */
export function t(key, vars) {
  const table = STRINGS[current] || STRINGS.en;
  let s = table[key] ?? STRINGS.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}

function isBot() {
  return /Googlebot|bingbot|YandexBot|DuckDuckBot|Baiduspider|Slurp|GPTBot|Applebot/i.test(
    navigator.userAgent,
  );
}

export function detectLocale() {
  if (isBot()) return "en";
  const q = new URLSearchParams(location.search).get("lang");
  if (q && LOCALES.includes(q)) return q;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LOCALES.includes(stored)) return stored;
  } catch {
    /* private mode */
  }
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("ru") || nav.startsWith("uk") || nav.startsWith("be")) return "ru";
  if (nav.startsWith("fr")) return "fr";
  return "en";
}

function applyDom() {
  document.documentElement.lang = current;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (!key) return;
    el.innerHTML = t(key);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (key) el.setAttribute("aria-label", t(key));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key) el.setAttribute("title", t(key));
  });

  document.title = t("metaTitle");
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", t("metaDesc"));

  document.querySelectorAll(".lang-switch [data-lang]").forEach((btn) => {
    const on = btn.getAttribute("data-lang") === current;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.classList.toggle("is-on", on);
  });
}

/**
 * @param {string} lang
 * @param {{ persist?: boolean, url?: boolean }} [opts]
 */
export function setLocale(lang, opts = {}) {
  if (!LOCALES.includes(lang)) lang = "en";
  current = lang;
  if (opts.persist !== false) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }
  if (opts.url !== false) {
    const url = new URL(location.href);
    if (lang === "en") url.searchParams.delete("lang");
    else url.searchParams.set("lang", lang);
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
  applyDom();
  listeners.forEach((fn) => fn(lang));
}

/** @param {(lang: string) => void} fn */
export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initI18n() {
  const lang = detectLocale();
  setLocale(lang, { persist: !isBot(), url: Boolean(new URLSearchParams(location.search).get("lang")) });

  document.querySelector(".lang-switch")?.addEventListener("click", (e) => {
    const btn = e.target instanceof HTMLElement ? e.target.closest("[data-lang]") : null;
    const next = btn?.getAttribute("data-lang");
    if (next) setLocale(next);
  });
}
