use std::{
    collections::HashMap,
    path::PathBuf,
    sync::{Arc, Mutex},
    thread,
};

use notify::{RecursiveMode, Watcher};
use rayon::iter::{ParallelBridge, ParallelIterator};
use serde::Serialize;
use sysinfo::Disk;
use tokio::task::block_in_place;
use walkdir::WalkDir;

use crate::{AppStateSafe, CachePath, DIRECTORY, FILE};

use super::cacheutils::FileSystemEventHandler;

#[derive(Serialize)]
pub struct Volume {
    name: String,
    mount_point: PathBuf,
}

impl Volume {
    pub fn from(disk: &Disk) -> Self {
        let name = {
            let volume_name = disk.name().to_str().unwrap();
            match volume_name.is_empty() {
                true => "Local Volume",
                false => volume_name,
            }
            .to_string()
        };

        let mount_point = disk.mount_point().to_path_buf();

        Self { name, mount_point }
    }

    pub fn create_cache(&self, state_mutex: &AppStateSafe) {
        let state = &mut state_mutex.lock().unwrap();

        let volume = state
            .sys_cache
            .entry(self.mount_point.to_string_lossy().to_string())
            .or_insert_with(HashMap::new);

        let sys_cache = Arc::new(Mutex::new(volume));

        WalkDir::new(self.mount_point.clone())
            .into_iter()
            .par_bridge()
            .filter_map(Result::ok)
            .for_each(|entry| {
                let f_name = entry.file_name().to_string_lossy().to_string();
                let f_path = entry.path().to_string_lossy().to_string();
                let walkdir_f_type = entry.file_type();
                let f_type = if walkdir_f_type.is_dir() {
                    DIRECTORY
                } else {
                    FILE
                }
                .to_string();

                let cache_guard = &mut sys_cache.lock().unwrap();
                cache_guard
                    .entry(f_name)
                    .or_insert_with(Vec::new)
                    .push(CachePath { f_path, f_type })
            });
    }

    pub fn observe_changes(&self, state_mutex: &AppStateSafe) {
        let mut fs_event_mgr =
            FileSystemEventHandler::new(state_mutex.clone(), self.mount_point.clone());

        let mut observer = notify::recommended_watcher(move |res| match res {
            Ok(event) => fs_event_mgr.handle_event(event),
            Err(e) => panic!("failed to handle event {:?}", e),
        })
        .unwrap();

        let path = self.mount_point.clone();

        thread::spawn(move || {
            observer.watch(&path, RecursiveMode::Recursive).unwrap();

            block_in_place(|| loop {
                thread::park();
            });
        });
    }
}
