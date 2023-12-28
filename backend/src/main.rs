// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{os::windows::process::CommandExt, path::PathBuf};
use tauri::{api::path, async_runtime, Manager};
use tauri_plugin_store::StoreBuilder;
use which::which;

mod python;

use crate::python::python_mod::{create_or_start_server, is_python3_really_available_in_windows};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            let main_window = app.get_window("main").unwrap();
            let main_py_path = app
                .path_resolver()
                .resolve_resource("engine/main.py")
                .expect("Error Read main.py");
            let requirement_path = app
                .path_resolver()
                .resolve_resource("engine/requirements.txt")
                .expect("Error Read requirements.txt");
            let home_dir = path::home_dir().unwrap();
            let mut store_file_path = PathBuf::new();
            store_file_path.push(home_dir);
            store_file_path.push("filesense.bin");
            let mut store = StoreBuilder::new(app.handle(), store_file_path).build();

            match store.load() {
                Ok(store) => store,
                Err(_) => println!("Store not found. Creating one..."),
            }

            #[cfg(not(debug_assertions))]
            let python_path = match which("python3") {
                Ok(path) => path,
                Err(_) => match which("python") {
                    Ok(path) => path,
                    Err(_) => std::process::exit(1),
                },
            };

            #[cfg(debug_assertions)]
            let python_path = PathBuf::from(
                "D:\\Coding Stuff\\Rust Programming\\file-sense-app\\venv\\Scripts\\python.exe",
            );

            async_runtime::spawn(async move {
                if cfg!(windows) && !is_python3_really_available_in_windows(&python_path) {
                    if let Ok(python_path) = which("python") {
                        create_or_start_server(
                            python_path,
                            main_py_path,
                            store,
                            requirement_path,
                            &main_window,
                            &splashscreen_window,
                        );
                    } else {
                        std::process::exit(1);
                    }
                } else {
                    create_or_start_server(
                        python_path,
                        main_py_path,
                        store,
                        requirement_path,
                        &main_window,
                        &splashscreen_window,
                    );
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
