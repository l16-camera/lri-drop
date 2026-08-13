/**
 * Desktop i18n — same locales as the landing (EN primary, FR / JA / RU).
 * Choice lives in localStorage; first launch follows the OS language.
 */

export const LOCALES = ["en", "fr", "ja", "ru"];

export const LOCALE_OPTS = [
  { id: "en", label: "EN" },
  { id: "fr", label: "FR" },
  { id: "ja", label: "日本語" },
  { id: "ru", label: "RU" },
];

export const STORAGE_KEY = "lri-lang";

/** @type {Record<string, Record<string, string>>} */
export const STRINGS = {
  en: {
    langAria: "Language",
    winTitle: "LRI Drop — Light Raw → DNG",
    brandSub: "Light Raw → DNG · drop or from camera",
    camNoAdb: "no adb",
    camOffline: "camera offline",
    camTitleOffline: "No Light camera (adb)",
    outputPick: "Output folder…",
    dropTitle: "Drop .lri files here",
    dropRelease: "Release to add",
    dropHintBefore: "or",
    dropPickCam: "pick from Light camera",
    dropHintAfter: "· mono as",
    toggleMono: "Mono only (A2 / C6)",
    togglePrev: "Mono PNG previews",
    convert: "Convert",
    convertN: "Convert {n}",
    converting: "Converting…",
    toastDropLri: "Drop .lri files",
    toastAddedCam: "Added {n} from camera",
    queueEmpty: "Queue empty — drop files or open camera",
    filesOne: "1 file",
    filesMany: "{n} files",
    statDone: "{n} done",
    statErr: "{n} err",
    statWorking: "working…",
    clearDone: "Clear done",
    chipCamera: "camera",
    chipMono: "mono {cams}",
    removeAria: "Remove",
    statusPulling: "Pulling from camera…",
    statusReading: "Reading…",
    modulesReady: "{n} modules ready",
    statusRunning: "{camera} · {n}%",
    openFolder: "{n} DNG{mono} → open",
    openMono: " · {n} mono",
    camModalTitle: "Light camera",
    camSearching: "Searching via adb…",
    camListing: "Listing /sdcard/DCIM/Camera…",
    camCaptures: "{n} captures · {sel} selected",
    camAll: "All",
    camNone: "None",
    camRefresh: "Refresh",
    camCancel: "Cancel",
    camPulling: "Pulling…",
    camAdd: "Add to queue",
    camAddN: "Add {n} to queue",
    unitMm: "{n} mm",
    noteCache: "cached {name}",
    notePull: "adb pull {name}…",
    errNoCamera: "No camera online — connect Light L16 via USB",
    errAdbMissing: "adb not found — install Android platform-tools or set ADB=/path/to/adb",
    errNoDevice: "No Android device online — plug in the Light L16",
    errNoRemoteLri: "No .lri under /sdcard/DCIM/Camera",
    errNotFile: "Not a file",
    errNotLri: "Expected a .lri file",
    errNoMono: "No mono modules (A2/C6) in this file",
    errPullMissing: "Pull finished but the file is missing",
    errAdbSpawn: "adb spawn failed: {detail}",
    errAdbPull: "adb pull failed: {detail}",
  },

  ja: {
    langAria: "言語",
    winTitle: "LRI Drop — Light Raw → DNG",
    brandSub: "Light Raw → DNG · ドロップまたはカメラから",
    camNoAdb: "adb なし",
    camOffline: "カメラオフライン",
    camTitleOffline: "Light カメラなし (adb)",
    outputPick: "出力フォルダ…",
    dropTitle: ".lri をここにドロップ",
    dropRelease: "離して追加",
    dropHintBefore: "または",
    dropPickCam: "Light カメラから選ぶ",
    dropHintAfter: "· モノクロは",
    toggleMono: "モノクロのみ (A2 / C6)",
    togglePrev: "モノクロ PNG プレビュー",
    convert: "変換",
    convertN: "変換 {n}",
    converting: "変換中…",
    toastDropLri: ".lri をドロップ",
    toastAddedCam: "カメラから {n} 件追加",
    queueEmpty: "キューは空 — ファイルをドロップするかカメラを開く",
    filesOne: "1 ファイル",
    filesMany: "{n} ファイル",
    statDone: "{n} 完了",
    statErr: "{n} エラー",
    statWorking: "処理中…",
    clearDone: "完了を消す",
    chipCamera: "カメラ",
    chipMono: "モノクロ {cams}",
    removeAria: "削除",
    statusPulling: "カメラから取り込み中…",
    statusReading: "読み込み中…",
    modulesReady: "{n} モジュール準備完了",
    statusRunning: "{camera} · {n}%",
    openFolder: "{n} DNG{mono} → 開く",
    openMono: " · モノクロ {n}",
    camModalTitle: "Light カメラ",
    camSearching: "adb で検索中…",
    camListing: "/sdcard/DCIM/Camera を一覧…",
    camCaptures: "{n} 枚 · {sel} 選択",
    camAll: "すべて",
    camNone: "なし",
    camRefresh: "更新",
    camCancel: "キャンセル",
    camPulling: "取り込み中…",
    camAdd: "キューに追加",
    camAddN: "{n} 件をキューへ",
    unitMm: "{n} mm",
    noteCache: "キャッシュ {name}",
    notePull: "adb pull {name}…",
    errNoCamera: "カメラがオンラインではありません — Light L16 を USB で接続",
    errAdbMissing: "adb が見つかりません — Android platform-tools を入れるか ADB= を設定",
    errNoDevice: "Android デバイスがありません — Light L16 を接続",
    errNoRemoteLri: "/sdcard/DCIM/Camera に .lri がありません",
    errNotFile: "ファイルではありません",
    errNotLri: ".lri ファイルが必要です",
    errNoMono: "このファイルにモノクロモジュール (A2/C6) がありません",
    errPullMissing: "取り込みは終わったがファイルがありません",
    errAdbSpawn: "adb の起動に失敗: {detail}",
    errAdbPull: "adb pull に失敗: {detail}",
  },

  ru: {
    langAria: "Язык",
    winTitle: "LRI Drop — Light Raw → DNG",
    brandSub: "Light Raw → DNG · с диска или с камеры",
    camNoAdb: "нет adb",
    camOffline: "камера офлайн",
    camTitleOffline: "Нет камеры Light (adb)",
    outputPick: "Папка вывода…",
    dropTitle: "Бросьте сюда .lri",
    dropRelease: "Отпустите, чтобы добавить",
    dropHintBefore: "или",
    dropPickCam: "выбрать с камеры Light",
    dropHintAfter: "· моно как",
    toggleMono: "Только моно (A2 / C6)",
    togglePrev: "PNG-превью моно",
    convert: "Конвертировать",
    convertN: "Конвертировать {n}",
    converting: "Конвертация…",
    toastDropLri: "Бросьте файлы .lri",
    toastAddedCam: "С камеры добавлено: {n}",
    queueEmpty: "Очередь пуста — бросьте файлы или откройте камеру",
    filesOne: "1 файл",
    filesMany: "{n} файлов",
    statDone: "{n} готово",
    statErr: "{n} ош.",
    statWorking: "идёт…",
    clearDone: "Убрать готовое",
    chipCamera: "камера",
    chipMono: "моно {cams}",
    removeAria: "Убрать",
    statusPulling: "Тянем с камеры…",
    statusReading: "Читаем…",
    modulesReady: "{n} модулей готовы",
    statusRunning: "{camera} · {n}%",
    openFolder: "{n} DNG{mono} → открыть",
    openMono: " · {n} моно",
    camModalTitle: "Камера Light",
    camSearching: "Ищем через adb…",
    camListing: "Список /sdcard/DCIM/Camera…",
    camCaptures: "{n} кадров · выбрано {sel}",
    camAll: "Все",
    camNone: "Снять",
    camRefresh: "Обновить",
    camCancel: "Отмена",
    camPulling: "Тянем…",
    camAdd: "В очередь",
    camAddN: "В очередь · {n}",
    unitMm: "{n} мм",
    noteCache: "кэш {name}",
    notePull: "adb pull {name}…",
    errNoCamera: "Камера не в сети — подключите Light L16 по USB",
    errAdbMissing: "adb не найден — поставьте Android platform-tools или задайте ADB=",
    errNoDevice: "Нет Android-устройства — воткните Light L16",
    errNoRemoteLri: "В /sdcard/DCIM/Camera нет .lri",
    errNotFile: "Это не файл",
    errNotLri: "Нужен файл .lri",
    errNoMono: "В этом файле нет мономодулей (A2/C6)",
    errPullMissing: "Pull закончился, а файла нет",
    errAdbSpawn: "adb не запустился: {detail}",
    errAdbPull: "adb pull не вышел: {detail}",
  },

  fr: {
    langAria: "Langue",
    winTitle: "LRI Drop — Light Raw → DNG",
    brandSub: "Light Raw → DNG · dépôt ou depuis l’appareil",
    camNoAdb: "pas d’adb",
    camOffline: "appareil hors ligne",
    camTitleOffline: "Pas d’appareil Light (adb)",
    outputPick: "Dossier de sortie…",
    dropTitle: "Déposez les .lri ici",
    dropRelease: "Relâchez pour ajouter",
    dropHintBefore: "ou",
    dropPickCam: "choisir depuis le Light",
    dropHintAfter: "· mono en",
    toggleMono: "Mono seulement (A2 / C6)",
    togglePrev: "Aperçus PNG mono",
    convert: "Convertir",
    convertN: "Convertir {n}",
    converting: "Conversion…",
    toastDropLri: "Déposez des fichiers .lri",
    toastAddedCam: "{n} ajouté(s) depuis l’appareil",
    queueEmpty: "File vide — déposez des fichiers ou ouvrez l’appareil",
    filesOne: "1 fichier",
    filesMany: "{n} fichiers",
    statDone: "{n} faits",
    statErr: "{n} err.",
    statWorking: "en cours…",
    clearDone: "Retirer les faits",
    chipCamera: "appareil",
    chipMono: "mono {cams}",
    removeAria: "Retirer",
    statusPulling: "Transfert depuis l’appareil…",
    statusReading: "Lecture…",
    modulesReady: "{n} modules prêts",
    statusRunning: "{camera} · {n}%",
    openFolder: "{n} DNG{mono} → ouvrir",
    openMono: " · {n} mono",
    camModalTitle: "Appareil Light",
    camSearching: "Recherche via adb…",
    camListing: "Liste de /sdcard/DCIM/Camera…",
    camCaptures: "{n} vues · {sel} sélectionnée(s)",
    camAll: "Tout",
    camNone: "Aucun",
    camRefresh: "Actualiser",
    camCancel: "Annuler",
    camPulling: "Transfert…",
    camAdd: "Ajouter à la file",
    camAddN: "Ajouter {n} à la file",
    unitMm: "{n} mm",
    noteCache: "cache {name}",
    notePull: "adb pull {name}…",
    errNoCamera: "Aucun appareil en ligne — branchez le Light L16 en USB",
    errAdbMissing: "adb introuvable — installez Android platform-tools ou définissez ADB=",
    errNoDevice: "Aucun appareil Android — branchez le Light L16",
    errNoRemoteLri: "Pas de .lri dans /sdcard/DCIM/Camera",
    errNotFile: "Ce n’est pas un fichier",
    errNotLri: "Un fichier .lri est attendu",
    errNoMono: "Pas de modules mono (A2/C6) dans ce fichier",
    errPullMissing: "Le pull est fini mais le fichier manque",
    errAdbSpawn: "échec au lancement d’adb : {detail}",
    errAdbPull: "échec d’adb pull : {detail}",
  },
};

/**
 * @param {string} locale
 * @param {string} key
 * @param {Record<string, string | number>} [vars]
 */
export function tr(locale, key, vars) {
  const table = STRINGS[locale] || STRINGS.en;
  let s = table[key] ?? STRINGS.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}

/** @param {string} raw */
export function detectLocale(raw) {
  const q = (raw ?? "").toLowerCase();
  if (LOCALES.includes(q)) return q;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LOCALES.includes(stored)) return stored;
  } catch {
    /* private mode */
  }
  const nav = (typeof navigator !== "undefined" ? navigator.language : "en").toLowerCase();
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("ru") || nav.startsWith("uk") || nav.startsWith("be")) return "ru";
  if (nav.startsWith("fr")) return "fr";
  return "en";
}

/**
 * @param {string} locale
 * @param {unknown} err
 */
export function formatError(locale, err) {
  const raw = String(err ?? "");
  if (!raw) return "";
  if (STRINGS.en[raw] || STRINGS[locale]?.[raw]) return tr(locale, raw);
  if (raw.includes("adb not found")) return tr(locale, "errAdbMissing");
  if (raw.includes("no Android device online") || raw.includes("No camera online")) {
    return tr(locale, raw.includes("camera") ? "errNoCamera" : "errNoDevice");
  }
  if (raw.includes("no .lri under")) return tr(locale, "errNoRemoteLri");
  if (raw.includes("pull finished but file missing")) return tr(locale, "errPullMissing");
  if (raw.startsWith("not a file:")) return tr(locale, "errNotFile");
  if (raw === "expected a .lri file") return tr(locale, "errNotLri");
  if (raw.includes("no mono modules")) return tr(locale, "errNoMono");
  if (raw.startsWith("adb spawn failed")) {
    return tr(locale, "errAdbSpawn", { detail: raw.replace(/^adb spawn failed:\s*/i, "") });
  }
  if (raw.startsWith("adb pull failed") || raw.startsWith("adb pull:")) {
    return tr(locale, "errAdbPull", {
      detail: raw.replace(/^adb pull(?: failed)?:\s*/i, ""),
    });
  }
  return raw;
}

/**
 * @param {string} locale
 * @param {string} [raw]
 */
export function formatPullNote(locale, raw) {
  if (!raw) return "";
  const cache = raw.match(/^cache hit\s+(.+)$/i);
  if (cache) return tr(locale, "noteCache", { name: cache[1] });
  const pull = raw.match(/^adb pull\s+(.+?)(?:…|\.\.\.)?$/i);
  if (pull) return tr(locale, "notePull", { name: pull[1] });
  if (raw === "cached") return tr(locale, "noteCache", { name: "" }).trim();
  if (raw === "pulled" || raw === "adb pull…") return "";
  return raw;
}
