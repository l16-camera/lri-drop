//! LRI Drop — Tauri backend.
//! Uses public `light` from luminat (extract/inspect) + local `camera` (adb).

mod camera;

use std::path::PathBuf;

use camino::Utf8PathBuf;
use serde::Serialize;
use tauri::{AppHandle, Emitter, State};
use tauri_plugin_dialog::DialogExt;

#[derive(Clone, Serialize)]
struct ConvertProgress {
	file: String,
	done: usize,
	total: usize,
	camera: String,
	phase: String,
}

#[derive(Serialize)]
struct ConvertResult {
	input: String,
	output_dir: String,
	image_count: usize,
	mono_count: usize,
	files: Vec<String>,
}

#[derive(Serialize)]
struct PullResult {
	local_path: String,
	name: String,
	from_cache: bool,
}

struct AppState {
	output_root: std::sync::Mutex<Option<String>>,
	cache_dir: PathBuf,
}

impl Default for AppState {
	fn default() -> Self {
		Self {
			output_root: std::sync::Mutex::new(None),
			cache_dir: camera::default_cache_dir(),
		}
	}
}

fn is_mono_sensor(sensor: &str) -> bool {
	sensor.to_ascii_lowercase().contains("mono")
}

#[tauri::command]
fn inspect_lri(path: String) -> Result<light::api::LriSummary, String> {
	light::api::inspect_file(&path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn pick_output_dir(
	app: AppHandle,
	state: State<'_, AppState>,
) -> Result<Option<String>, String> {
	let path = app.dialog().file().blocking_pick_folder();
	let s = path.map(|p| p.to_string());
	if let Some(ref p) = s {
		*state.output_root.lock().unwrap() = Some(p.clone());
	}
	Ok(s)
}

#[tauri::command]
fn get_output_root(state: State<'_, AppState>) -> Option<String> {
	state.output_root.lock().unwrap().clone()
}

#[tauri::command]
fn set_output_root(state: State<'_, AppState>, path: String) {
	*state.output_root.lock().unwrap() = Some(path);
}

#[tauri::command]
fn camera_status() -> camera::CameraStatus {
	camera::status()
}

#[tauri::command]
fn list_camera_lri(serial: Option<String>) -> Result<Vec<camera::RemoteLri>, String> {
	camera::list_lri(serial.as_deref())
}

#[tauri::command]
async fn pull_camera_lri(
	app: AppHandle,
	state: State<'_, AppState>,
	remote_path: String,
	name: String,
	size: Option<u64>,
	serial: Option<String>,
) -> Result<PullResult, String> {
	let cache = state.cache_dir.clone();
	let app2 = app.clone();
	let name2 = name.clone();

	tauri::async_runtime::spawn_blocking(move || {
		let (local, from_cache) =
			camera::pull_lri(serial.as_deref(), &remote_path, &cache, size, |note| {
				let _ = app2.emit(
					"convert-progress",
					ConvertProgress {
						file: name2.clone(),
						done: 0,
						total: 1,
						camera: note.to_string(),
						phase: "pull".into(),
					},
				);
			})?;
		Ok(PullResult {
			local_path: local.display().to_string(),
			name,
			from_cache,
		})
	})
	.await
	.map_err(|e| e.to_string())?
}

#[tauri::command]
async fn convert_lri(
	app: AppHandle,
	input: String,
	output: String,
	only_mono: bool,
	mono_previews: bool,
) -> Result<ConvertResult, String> {
	let input_path = Utf8PathBuf::from(&input);
	if !input_path.is_file() {
		return Err(format!("not a file: {input}"));
	}
	if input_path
		.extension()
		.map(|e| e.eq_ignore_ascii_case("lri"))
		!= Some(true)
	{
		return Err("expected a .lri file".into());
	}

	let stem = input_path.file_stem().unwrap_or("out");
	let out_path = Utf8PathBuf::from(&output).join(stem);
	let file_name = input_path.file_name().unwrap_or("file.lri").to_string();

	let summary = light::api::inspect_file(input_path.as_std_path()).map_err(|e| e.to_string())?;
	let mono_ids: Vec<String> = summary
		.cameras
		.iter()
		.filter(|c| is_mono_sensor(&c.sensor))
		.map(|c| c.id.clone())
		.collect();

	if only_mono && mono_ids.is_empty() {
		return Err("no mono modules (A2/C6) in this file".into());
	}

	let app2 = app.clone();
	let file_label = file_name.clone();
	let out_for_job = out_path.clone();
	let input_for_job = input_path.clone();

	tauri::async_runtime::spawn_blocking(move || {
		let _ = app2.emit(
			"convert-progress",
			ConvertProgress {
				file: file_label.clone(),
				done: 0,
				total: 1,
				camera: "…".into(),
				phase: "start".into(),
			},
		);
		// Upstream light API: (input, output, jobs, on_progress) -> Result<()>
		light::extract::run_with_progress(&input_for_job, &out_for_job, None, {
			let app3 = app2.clone();
			let file_label = file_label.clone();
			move |done, total, camera| {
				let _ = app3.emit(
					"convert-progress",
					ConvertProgress {
						file: file_label.clone(),
						done,
						total,
						camera: camera.to_string(),
						phase: "module".into(),
					},
				);
			}
		})
		.map_err(|e| e.to_string())
	})
	.await
	.map_err(|e| e.to_string())??;

	// Collect written DNGs; optionally keep only mono cameras
	let mut files = Vec::new();
	if out_path.is_dir() {
		let rd = std::fs::read_dir(out_path.as_std_path()).map_err(|e| e.to_string())?;
		for entry in rd.flatten() {
			let p = entry.path();
			let name = p
				.file_name()
				.and_then(|s| s.to_str())
				.unwrap_or("")
				.to_string();
			if !name.to_ascii_lowercase().ends_with(".dng") {
				continue;
			}
			let cam = name.trim_end_matches(".dng").trim_end_matches(".DNG");
			// strip _mono suffix if present
			let cam_id = cam.strip_suffix("_mono").unwrap_or(cam);
			if only_mono && !mono_ids.iter().any(|m| m == cam_id) {
				let _ = std::fs::remove_file(&p);
				continue;
			}
			files.push(name);
		}
	}
	files.sort();

	// Optional mono PNG previews via light::thumbnail
	if mono_previews && !mono_ids.is_empty() {
		let mono_dir = out_path.join("mono");
		let _ = std::fs::create_dir_all(mono_dir.as_std_path());
		if let Ok(session) = light::session::LriSession::open(input_path.as_std_path()) {
			let _ = session.with_lri(|lri| {
				for id in &mono_ids {
					if let Some(cid) = light::thumbnail::parse_camera_id(id) {
						if let Ok((bytes, w, h, _)) =
							light::thumbnail::render_preview_gray(lri, cid, 2048)
						{
							let path = mono_dir.join(format!("{id}.png"));
							if let Ok(f) = std::fs::File::create(path.as_std_path()) {
								let mut enc = png::Encoder::new(f, w, h);
								enc.set_color(png::ColorType::Grayscale);
								enc.set_depth(png::BitDepth::Eight);
								if let Ok(mut wtr) = enc.write_header() {
									let _ = wtr.write_image_data(&bytes);
									files.push(format!("mono/{id}.png"));
								}
							}
						}
					}
				}
				Ok::<(), anyhow::Error>(())
			});
		}
	}

	let mono_count = files
		.iter()
		.filter(|f| {
			let base = f
				.trim_end_matches(".dng")
				.trim_end_matches(".DNG")
				.trim_end_matches(".png");
			let base = base.strip_prefix("mono/").unwrap_or(base);
			let cam = base.strip_suffix("_mono").unwrap_or(base);
			mono_ids.iter().any(|m| m == cam)
		})
		.count();

	let image_count = files
		.iter()
		.filter(|f| f.ends_with(".dng") || f.ends_with(".DNG"))
		.count();

	let _ = app.emit(
		"convert-progress",
		ConvertProgress {
			file: file_name,
			done: image_count.max(1),
			total: image_count.max(1),
			camera: "done".into(),
			phase: "done".into(),
		},
	);

	Ok(ConvertResult {
		input,
		output_dir: out_path.to_string(),
		image_count,
		mono_count,
		files,
	})
}

#[tauri::command]
fn reveal_path(path: String) -> Result<(), String> {
	#[cfg(target_os = "macos")]
	{
		std::process::Command::new("open")
			.arg(&path)
			.status()
			.map_err(|e| e.to_string())?;
	}
	#[cfg(target_os = "windows")]
	{
		std::process::Command::new("explorer")
			.arg(&path)
			.status()
			.map_err(|e| e.to_string())?;
	}
	#[cfg(all(unix, not(target_os = "macos")))]
	{
		std::process::Command::new("xdg-open")
			.arg(&path)
			.status()
			.map_err(|e| e.to_string())?;
	}
	Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.manage(AppState::default())
		.plugin(tauri_plugin_dialog::init())
		.invoke_handler(tauri::generate_handler![
			inspect_lri,
			pick_output_dir,
			get_output_root,
			set_output_root,
			convert_lri,
			reveal_path,
			camera_status,
			list_camera_lri,
			pull_camera_lri,
		])
		.run(tauri::generate_context!())
		.expect("error while running LRI Drop");
}
