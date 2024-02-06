// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod common;
mod python;

use crate::commands::*;
use crate::common::*;
use crate::python::*;
use once_cell::sync::OnceCell;
#[cfg(debug_assertions)]
use std::path::PathBuf;
use std::sync::Mutex;
#[cfg(not(debug_assertions))]
use std::{fs, os::windows::process::CommandExt, path::PathBuf};
use tauri::api::dialog;
use tauri::SystemTray;
use tauri::SystemTrayEvent;
use tauri::{api::path, async_runtime, Manager};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};
use tauri_plugin_store::StoreBuilder;
use which::which;

// Global AppHandle
pub static APP: OnceCell<tauri::AppHandle> = OnceCell::new();

struct Indexing(pub Mutex<bool>);

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let restore = CustomMenuItem::new("hide".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
        .add_item(restore)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let tray = SystemTray::new().with_menu(tray_menu);
    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                show_hide_main_window(app, true);
            }
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                show_hide_main_window(app, true);
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    if is_indexing(app) {
                            let window = app.get_window("main").unwrap();
                        dialog::MessageDialogBuilder::new("Still Indexing...", "Some folders are still indexing in the background do you really want to close this Application.\nIf you close Indexing process it will damage the index and may be errors can be occured").kind(dialog::MessageDialogKind::Warning).parent(&window).show(|button_press| {
                            if button_press {
                                std::process::exit(0);
                            }
                        });
                    }
                }
                "hide" => {
                    show_hide_main_window(app, false);
                }
                _ => {}
            },
            _ => {}
        })
        .manage(Indexing(Mutex::new(false)))
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            APP.get_or_init(|| app.handle());
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
            store_file_path.push(".filesense");
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
        .invoke_handler(tauri::generate_handler![
            greet,
            show_in_folder,
            set_index_state
        ])
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                let app_handle = APP.get().unwrap();
                if is_indexing(app_handle) {
                    event.window().hide().unwrap();
                    api.prevent_close();
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
