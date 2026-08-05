

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
	/// Last chosen output root (sticky for batch drops).
	output_root: std::sync::Mutex<Option<String>>,
	/// Local cache for camera pulls.
	cache_dir: PathBuf,
}

impl Default for AppState {
	fn default() -> Self {
		Self {
			output_root: std::sync::Mutex::new(None),
			cache_dir: light::camera::default_cache_dir(),
		}
	}
}

#[tauri::command]
fn inspect_lri(path: String) -> Result<light::api::LriSummary, String> {
	light::api::inspect_file(&path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn pick_output_dir(app: AppHandle, state: State<'_, AppState>) -> Result<Option<String>, String> {
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
fn camera_status() -> light::camera::CameraStatus {
	light::camera::status()
}

#[tauri::command]
fn list_camera_lri(serial: Option<String>) -> Result<Vec<light::camera::RemoteLri>, String> {
	light::camera::list_lri(serial.as_deref())
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
			light::camera::pull_lri(serial.as_deref(), &remote_path, &cache, size, |note| {
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
	let file_name = input_path
		.file_name()
		.unwrap_or("file.lri")
		.to_string();

	let opts = light::extract::ExtractOptions {
		jobs: None,
		only_mono,
		mono_previews,
	};

	let app2 = app.clone();
	let file_label = file_name.clone();
	let report = tauri::async_runtime::spawn_blocking(move || {
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
		light::extract::run_with_progress(
			&input_path,
			&out_path,
			opts,
			{
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
			},
		)
		.map_err(|e| e.to_string())
		.map(|report| (out_path, report))
	})
	.await
	.map_err(|e| e.to_string())??;

	let (out_path, report) = report;
	let _ = app.emit(
		"convert-progress",
		ConvertProgress {
			file: file_name.clone(),
			done: report.image_count,
			total: report.image_count.max(1),
			camera: "done".into(),
			phase: "done".into(),
		},
	);

	Ok(ConvertResult {
		input,
		output_dir: out_path.to_string(),
		image_count: report.image_count,
		mono_count: report.mono_count,
		files: report.files,
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
