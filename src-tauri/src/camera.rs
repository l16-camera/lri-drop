//! Light L16 over ADB — list / pull `.lri` from `/sdcard/DCIM/Camera/`.

use std::path::{Path, PathBuf};
use std::process::Command;

use serde::Serialize;

const REMOTE_DIR: &str = "/sdcard/DCIM/Camera";

#[derive(Debug, Clone, Serialize)]
pub struct CameraDevice {
	pub serial: String,
	pub model: String,
	pub product: String,
	pub online: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct CameraStatus {
	pub adb_ok: bool,
	pub adb_path: Option<String>,
	pub devices: Vec<CameraDevice>,
	/// Preferred Light L16 (model L16 / device LFC) if any.
	pub light: Option<CameraDevice>,
}

#[derive(Debug, Clone, Serialize)]
pub struct RemoteLri {
	pub name: String,
	pub remote_path: String,
	pub size: u64,
	pub mtime: Option<String>,
}

fn adb_bin() -> Result<PathBuf, String> {
	if let Ok(p) = std::env::var("ADB") {
		let pb = PathBuf::from(p);
		if pb.is_file() {
			return Ok(pb);
		}
	}
	// common locations
	for c in [
		"/opt/homebrew/bin/adb",
		"/usr/local/bin/adb",
		"/Users/igor/Library/Android/sdk/platform-tools/adb",
	] {
		let p = PathBuf::from(c);
		if p.is_file() {
			return Ok(p);
		}
	}
	// PATH
	which("adb").ok_or_else(|| {
		"adb not found — install Android platform-tools or set ADB=/path/to/adb".into()
	})
}

fn which(name: &str) -> Option<PathBuf> {
	let path = std::env::var_os("PATH")?;
	for dir in std::env::split_paths(&path) {
		let p = dir.join(name);
		if p.is_file() {
			return Some(p);
		}
	}
	None
}

fn adb_cmd(serial: Option<&str>) -> Result<Command, String> {
	let bin = adb_bin()?;
	let mut c = Command::new(bin);
	if let Some(s) = serial {
		c.arg("-s").arg(s);
	}
	Ok(c)
}

fn run_adb(serial: Option<&str>, args: &[&str]) -> Result<String, String> {
	let mut c = adb_cmd(serial)?;
	c.args(args);
	let out = c.output().map_err(|e| format!("adb spawn failed: {e}"))?;
	if !out.status.success() {
		let err = String::from_utf8_lossy(&out.stderr);
		let stdout = String::from_utf8_lossy(&out.stdout);
		return Err(format!(
			"adb {} failed: {}{}",
			args.join(" "),
			err.trim(),
			if stdout.trim().is_empty() {
				String::new()
			} else {
				format!(" ({})", stdout.trim())
			}
		));
	}
	Ok(String::from_utf8_lossy(&out.stdout).into_owned())
}

pub fn status() -> CameraStatus {
	let adb_path = adb_bin().ok().map(|p| p.display().to_string());
	let adb_ok = adb_path.is_some();
	if !adb_ok {
		return CameraStatus {
			adb_ok: false,
			adb_path: None,
			devices: vec![],
			light: None,
		};
	}

	let raw = match run_adb(None, &["devices", "-l"]) {
		Ok(s) => s,
		Err(_) => {
			return CameraStatus {
				adb_ok: true,
				adb_path,
				devices: vec![],
				light: None,
			};
		}
	};

	let mut devices = Vec::new();
	for line in raw.lines().skip(1) {
		let line = line.trim();
		if line.is_empty() {
			continue;
		}
		let mut parts = line.split_whitespace();
		let Some(serial) = parts.next() else { continue };
		let Some(state) = parts.next() else { continue };
		if state != "device" {
			continue;
		}
		let mut model = String::new();
		let mut product = String::new();
		for p in parts {
			if let Some(v) = p.strip_prefix("model:") {
				model = v.replace('_', " ");
			} else if let Some(v) = p.strip_prefix("product:") {
				product = v.to_string();
			}
		}
		devices.push(CameraDevice {
			serial: serial.to_string(),
			model,
			product,
			online: true,
		});
	}

	let light = devices
		.iter()
		.find(|d| {
			d.model.eq_ignore_ascii_case("L16")
				|| d.product.contains("LFC")
				|| d.serial.starts_with("LFCL")
		})
		.cloned()
		.or_else(|| devices.first().cloned());

	CameraStatus {
		adb_ok: true,
		adb_path,
		devices,
		light,
	}
}

pub fn list_lri(serial: Option<&str>) -> Result<Vec<RemoteLri>, String> {
	// Ensure device is up
	let st = status();
	if st.light.is_none() && st.devices.is_empty() {
		return Err("no Android device online — plug in the Light L16".into());
	}
	let serial = serial
		.map(|s| s.to_string())
		.or_else(|| st.light.map(|d| d.serial))
		.or_else(|| st.devices.first().map(|d| d.serial.clone()));

	// ls -l: -rw-rw---- root sdcard_rw SIZE DATE TIME NAME
	let raw = run_adb(
		serial.as_deref(),
		&["shell", &format!("ls -l {REMOTE_DIR}/*.lri 2>/dev/null")],
	)?;

	let mut out = Vec::new();
	for line in raw.lines() {
		let line = line.trim();
		if line.is_empty() || line.starts_with("total ") {
			continue;
		}
		// skip "No such file"
		if line.contains("No such file") {
			continue;
		}
		let parts: Vec<&str> = line.split_whitespace().collect();
		// expect at least: perms owner group size date time name
		if parts.len() < 7 {
			continue;
		}
		let name = parts[parts.len() - 1].to_string();
		if !name.to_ascii_lowercase().ends_with(".lri") {
			continue;
		}
		// size is typically index 3 on Android toolbox ls
		let size = parts
			.iter()
			.find_map(|p| p.parse::<u64>().ok().filter(|&n| n > 1_000_000))
			.unwrap_or(0);
		let mtime = if parts.len() >= 7 {
			Some(format!(
				"{} {}",
				parts[parts.len() - 3],
				parts[parts.len() - 2]
			))
		} else {
			None
		};
		// if name is absolute path, take basename
		let name = name.rsplit('/').next().unwrap_or(&name).to_string();
		out.push(RemoteLri {
			remote_path: format!("{REMOTE_DIR}/{name}"),
			name,
			size,
			mtime,
		});
	}
	out.sort_by(|a, b| a.name.cmp(&b.name));
	if out.is_empty() {
		return Err(format!("no .lri under {REMOTE_DIR}"));
	}
	Ok(out)
}

/// Pull remote `.lri` into `dest_dir`. Returns `(local_path, from_cache)`.
pub fn pull_lri(
	serial: Option<&str>,
	remote_path: &str,
	dest_dir: &Path,
	expected_size: Option<u64>,
	on_note: impl Fn(&str),
) -> Result<(PathBuf, bool), String> {
	std::fs::create_dir_all(dest_dir).map_err(|e| e.to_string())?;
	let name = Path::new(remote_path)
		.file_name()
		.and_then(|s| s.to_str())
		.ok_or_else(|| "bad remote path".to_string())?;
	let local = dest_dir.join(name);

	// skip if already complete (size match)
	if let Ok(meta) = std::fs::metadata(&local) {
		let want = expected_size.or_else(|| {
			list_lri(serial)
				.ok()
				.and_then(|list| list.into_iter().find(|r| r.name == name).map(|r| r.size))
		});
		if let Some(sz) = want {
			if sz > 0 && meta.len() == sz {
				on_note(&format!("cache hit {name}"));
				return Ok((local, true));
			}
		}
	}

	on_note(&format!("adb pull {name}…"));
	let st = status();
	let serial = serial
		.map(|s| s.to_string())
		.or_else(|| st.light.map(|d| d.serial))
		.or_else(|| st.devices.first().map(|d| d.serial.clone()));

	// remove partial
	let _ = std::fs::remove_file(&local);

	let mut c = adb_cmd(serial.as_deref())?;
	c.arg("pull").arg(remote_path).arg(&local);
	let out = c.output().map_err(|e| format!("adb pull: {e}"))?;
	if !out.status.success() {
		let err = String::from_utf8_lossy(&out.stderr);
		let _ = std::fs::remove_file(&local);
		return Err(format!("adb pull failed: {}", err.trim()));
	}
	if !local.is_file() {
		return Err("pull finished but file missing".into());
	}
	Ok((local, false))
}

pub fn default_cache_dir() -> PathBuf {
	if let Some(home) = std::env::var_os("HOME") {
		return PathBuf::from(home).join("Library/Caches/lri-drop/camera");
	}
	std::env::temp_dir().join("lri-drop-camera")
}
