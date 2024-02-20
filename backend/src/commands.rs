use std::{
    fs::{self, read_dir, File},
    ops::Deref,
    path::Path,
    process::Command,
    time::Instant,
};

use fuzzy_matcher::skim::SkimMatcherV2;
use notify::event::CreateKind;
use sysinfo::{Disks, System};
use tauri::State;

use crate::{
    error::Error,
    utils::{
        cacheutils::{load_sys_cache, FileSystemEventHandler, CACHE_F_PATH},
        searchutils::{check_file, score_f_name},
        volumeutils::Volume,
    },
    AppStateSafe, DirectoryChild, Indexing, SearchResults, MIN_SCORE,
};

#[tauri::command]
pub fn set_index_state(i_state: bool, state: State<Indexing>) {
    *state.0.lock().unwrap() = i_state;
}

#[tauri::command]
pub fn show_in_folder(path: &str) -> String {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", &path])
            .spawn()
            .unwrap();
        return "OK".to_string();
    }

    #[cfg(target_os = "linux")]
    {
        return "ERROR".to_string();
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open").args(["-R", &path]).spawn().unwrap();
        return "OK".to_string();
    }
}

#[tauri::command]
pub async fn get_volumes(state_mutex: State<'_, AppStateSafe>) -> Result<Vec<Volume>, ()> {
    let mut sys = System::new_all();
    sys.refresh_all();

    let mut cache_exists = fs::metadata(&CACHE_F_PATH[..]).is_ok();
    if cache_exists {
        cache_exists = load_sys_cache(&state_mutex);
    } else {
        File::create(&CACHE_F_PATH[..]).unwrap();
    }

    let disks = Disks::new_with_refreshed_list();
    let volumes = disks
        .list()
        .iter()
        .map(|disk| {
            let volume = Volume::from(disk);

            if !cache_exists {
                volume.create_cache(&state_mutex);
            }
            volume.observe_changes(&state_mutex);
            volume
        })
        .collect();

    Ok(volumes)
}

#[tauri::command]
pub async fn search_dir(
    search_directory: String,
    keyword: String,
    extension: String,
    state_mutex: State<'_, AppStateSafe>,
    accept_files: bool,
    accept_dirs: bool,
    mount_point: String,
) -> Result<SearchResults, ()> {
    let st_time = Instant::now();
    let mut results: Vec<_> = Vec::new();
    let mut fuzzy_scores: Vec<i16> = Vec::new();
    let matcher = SkimMatcherV2::default().smart_case();
    let state = state_mutex.lock().unwrap();
    let keyword = keyword.to_lowercase();
    let sys_cache = state.sys_cache.get(&mount_point).unwrap();
    for (f_name, paths) in sys_cache {
        for path in paths {
            let f_type = &path.f_type;
            let f_path = &path.f_path;

            if !f_path.starts_with(&search_directory) {
                continue;
            }

            if f_type == "file" {
                check_file(
                    f_name,
                    f_path,
                    &extension,
                    keyword.clone(),
                    &matcher,
                    accept_files,
                    &mut results,
                    &mut fuzzy_scores,
                );
                continue;
            }

            if !accept_dirs {
                continue;
            }

            let fuzz_score = score_f_name(f_name, &keyword, &matcher);
            if fuzz_score < MIN_SCORE {
                continue;
            }

            results.push(DirectoryChild::Directory(
                f_name.to_string(),
                f_path.to_string(),
            ));
            fuzzy_scores.push(fuzz_score);
        }
    }

    let end_time = Instant::now();
    let elapsed_time = (end_time - st_time).as_millis().to_string();
    let mut tuples: Vec<(usize, _)> = fuzzy_scores.iter().enumerate().collect();
    tuples.sort_by(|a, b| b.1.cmp(a.1));
    let sorted_results = tuples
        .into_iter()
        .map(|(idx, _)| results[idx].clone())
        .collect();
    Ok(SearchResults {
        files_directories: sorted_results,
        search_time: elapsed_time,
    })
}

#[tauri::command]
pub async fn open_file(path: String) -> Result<(), Error> {
    let output_res = open::commands(path)[0].output();
    let output = match output_res {
        Ok(output) => output,
        Err(err) => {
            let err_msg = format!("Failed to get open command output: {}", err);
            return Err(Error::Custom(err_msg));
        }
    };

    if output.status.success() {
        return Ok(());
    }

    let err_msg = String::from_utf8(output.stderr)
        .unwrap_or(String::from("Failed to open file and deserialize stderr."));
    Err(Error::Custom(err_msg))
}

#[tauri::command]
pub async fn open_directory(path: String) -> Result<Vec<DirectoryChild>, ()> {
    let Ok(directory) = read_dir(path) else {
        return Ok(Vec::new());
    };

    Ok(directory
        .map(|entry| {
            let entry = entry.unwrap();

            let file_name = entry.file_name().to_string_lossy().to_string();
            let entry_is_file = entry.file_type().unwrap().is_file();
            let entry = entry.path().to_string_lossy().to_string();

            if entry_is_file {
                return DirectoryChild::File(file_name, entry);
            }

            DirectoryChild::Directory(file_name, entry)
        })
        .collect())
}
