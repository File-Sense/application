use tauri::{AppHandle, Manager, State};

use crate::Indexing;

pub fn show_hide_main_window(app: &AppHandle, show: bool) {
    let window = app.get_window("main").unwrap();
    if show {
        if !window.is_visible().unwrap() {
            window.show().unwrap();
        }
    } else {
        if window.is_visible().unwrap() {
            window.hide().unwrap();
        }
    }
}

pub fn is_indexing(app: &AppHandle) -> bool {
    let indexing_state: State<Indexing> = app.state();
    if *indexing_state.0.lock().unwrap() {
        true
    } else {
        false
    }
}
