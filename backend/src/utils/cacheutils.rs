/*
* Reference
* @web_page {,
*   title = {conaticus/FileExplorer: Fast file explorer written with Tauri and React.},
*   url = {https://github.com/conaticus/FileExplorer},
* }
*/
use crate::{AppState, AppStateSafe, CachePath, VCache, DIRECTORY, FILE};
use lazy_static::lazy_static;
use notify::{
    event::{CreateKind, ModifyKind, RenameMode},
    Event,
};
use std::{
    fs::{self, File},
    io::{BufReader, Write},
    path::{Path, PathBuf},
    sync::{Arc, MutexGuard},
    time::Duration,
};
use tokio::time::interval;

lazy_static! {
    pub static ref CACHE_F_PATH: String = {
        let mut cache_path = dirs::cache_dir().expect("failed to get cache path");
        cache_path.push(format!("{}.bin", env!("CARGO_PKG_NAME")));
        cache_path.to_string_lossy().to_string()
    };
}

pub struct FileSystemEventHandler {
    mount_point: PathBuf,
    state_mutex: AppStateSafe,
}

impl FileSystemEventHandler {
    pub fn new(state_mutex: AppStateSafe, mount_point: PathBuf) -> Self {
        Self {
            state_mutex,
            mount_point,
        }
    }

    fn retrieve_from_cache<'a>(&self, state: &'a mut AppState) -> &'a mut VCache {
        let mount_point = self.mount_point.to_string_lossy().to_string();

        state
            .sys_cache
            .get_mut(&mount_point)
            .unwrap_or_else(|| panic!("failed to mount {:?} in cache", self.mount_point))
    }

    pub fn handle_create(&self, kind: CreateKind, path: &Path) {
        let state = &mut self.state_mutex.lock().unwrap();
        let current_volume = self.retrieve_from_cache(state);

        let filename = path.file_name().unwrap().to_string_lossy().to_string();
        let file_type = match kind {
            CreateKind::File => FILE,
            CreateKind::Folder => DIRECTORY,
            _ => return, // Other options are weird lol
        }
        .to_string();

        let file_path = path.to_string_lossy().to_string();
        current_volume.entry(filename).or_insert_with(|| {
            vec![CachePath {
                f_type: file_type,
                f_path: file_path,
            }]
        });
    }

    pub fn handle_delete(&self, path: &Path) {
        let state = &mut self.state_mutex.lock().unwrap();
        let current_volume = self.retrieve_from_cache(state);

        let filename = path.file_name().unwrap().to_string_lossy().to_string();
        current_volume.remove(&filename);
    }

    pub fn handle_rename_from(&mut self, old_path: &Path) {
        let state = &mut self.state_mutex.lock().unwrap();
        let current_volume = self.retrieve_from_cache(state);

        let old_path_string = old_path.to_string_lossy().to_string();
        let old_filename = old_path.file_name().unwrap().to_string_lossy().to_string();

        let empty_vec = &mut Vec::new();
        let cached_paths = current_volume.get_mut(&old_filename).unwrap_or(empty_vec);

        if cached_paths.len() <= 1 {
            current_volume.remove(&old_filename);
            return;
        }

        cached_paths.retain(|path| path.f_path != old_path_string);
    }

    pub fn handle_rename_to(&self, new_path: &Path) {
        let state = &mut self.state_mutex.lock().unwrap();
        let current_volume = self.retrieve_from_cache(state);

        let filename = new_path.file_name().unwrap().to_string_lossy().to_string();
        let file_type = if new_path.is_dir() { DIRECTORY } else { FILE };

        let path_string = new_path.to_string_lossy().to_string();
        current_volume.entry(filename).or_insert_with(|| {
            vec![CachePath {
                f_path: path_string,
                f_type: String::from(file_type),
            }]
        });
    }

    pub fn handle_event(&mut self, event: Event) {
        let paths = event.paths;

        match event.kind {
            notify::EventKind::Modify(modify_kind) => {
                if modify_kind == ModifyKind::Name(RenameMode::From) {
                    self.handle_rename_from(&paths[0]);
                } else if modify_kind == ModifyKind::Name(RenameMode::To) {
                    self.handle_rename_to(&paths[0]);
                }
            }
            notify::EventKind::Create(kind) => self.handle_create(kind, &paths[0]),
            notify::EventKind::Remove(_) => self.handle_delete(&paths[0]),
            _ => (),
        }
    }
}

fn save_to_cache(state: &mut MutexGuard<AppState>) {
    let serialized_cache = serde_bencode::to_string(&state.sys_cache).unwrap();

    let mut file = fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(&CACHE_F_PATH[..])
        .unwrap();

    file.write_all(
        &zstd::encode_all(serialized_cache.as_bytes(), 0).expect("failed to compress cache items")
            [..],
    )
    .unwrap();
}

pub fn save_system_cache(state_mutex: &AppStateSafe) {
    let state = &mut state_mutex.lock().unwrap();
    save_to_cache(state);
}

pub fn run_cache_interval(state_mutex: &AppStateSafe) {
    let state_clone = Arc::clone(state_mutex);

    tokio::spawn(async move {
        let mut interval = interval(Duration::from_secs(60));
        interval.tick().await; // Wait 30 seconds before doing first re-cache

        loop {
            interval.tick().await;

            let guard = &mut state_clone.lock().unwrap();
            save_to_cache(guard);
        }
    });
}

pub fn load_sys_cache(state_mutex: &AppStateSafe) -> bool {
    let state = &mut state_mutex.lock().expect("mutex lock failed");
    let cache_file = File::open(&CACHE_F_PATH[..]).expect("cache file open fail");
    let reader = BufReader::new(cache_file);

    if let Ok(decompressed) = zstd::decode_all(reader) {
        let deserialized_result = serde_bencode::from_bytes(&decompressed[..]);
        if let Ok(sys_cache) = deserialized_result {
            state.sys_cache = sys_cache;
            return true;
        }
    }
    false
}
