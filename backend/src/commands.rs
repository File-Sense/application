use std::process::Command;

use tauri::State;

use crate::Indexing;

#[tauri::command]
pub fn set_index_state(i_state: bool, state: State<Indexing>) {
    *state.0.lock().unwrap() = i_state;
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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
