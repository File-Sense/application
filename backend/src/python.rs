pub mod python_mod {
    use std::{fs, os::windows::process::CommandExt, path::PathBuf, process::Command, thread};

    use serde_json::json;
    use tauri::{Window, Wry};
    use tauri_plugin_store::Store;

    #[derive(Debug)]
    /// Python Deps Install Error
    struct PythonDepsInstallError;

    #[derive(Debug)]
    /// Python Server Start Error
    struct PythonServerStartError;

    /// Create No Window on launch
    const CREATE_NO_WINDOW: u32 = 0x08000000;

    /// Install Python Dependencies
    ///
    /// # Arguments
    ///
    /// * `python_path` - A Ref PathBuf that holds detected python or python3 path
    /// * `requirements_txt` - A PathBuf that holds requirements.txt file path
    /// * `first_file` - A PathBuf that holds - file path
    ///
    fn install_python_dependencies(
        python_path: &PathBuf,
        requirements_txt: PathBuf,
        mut store: Store<Wry>,
    ) -> Result<(), PythonDepsInstallError> {
        let install_status = Command::new(python_path)
            .arg("-m")
            .arg("pip")
            .arg("install")
            .arg("-r")
            .arg(requirements_txt.as_path())
            .creation_flags(CREATE_NO_WINDOW)
            .status()
            .expect("failed to install python deps");

        if install_status.success() {
            store
                .insert("first_run".to_string(), json!(false))
                .expect("set key error");
            store.save().unwrap();
            Ok(())
        } else {
            Err(PythonDepsInstallError)
        }
    }

    /// Check whether the python3 command is not a link to windows store
    ///
    /// # Arguments
    ///
    /// * `python_path` - A Ref PathBuf that holds detected python or python3 path
    ///
    pub fn is_python3_really_available_in_windows(python_path: &PathBuf) -> bool {
        if python_path.to_str().unwrap_or("").contains("WindowsApps") {
            false
        } else {
            true
        }
    }

    /// Start Python Server
    ///
    /// # Arguments
    ///
    /// * `python_path` - A Ref PathBuf that holds detected python or python3 path
    /// * `main_py_path` - A PathBuf that holds main.py file path
    ///
    fn start_python_server(python_path: PathBuf, main_py_path: PathBuf) {
        thread::spawn(move || {
            let _server_status = Command::new(python_path.as_path())
                .arg(main_py_path.as_path())
                .creation_flags(CREATE_NO_WINDOW)
                .status()
                .expect("error");
        });
    }

    /// This Function Install Python deps in first run & start python server else start python server
    ///
    /// # Arguments
    ///
    /// * `python_path` - A PathBuf that holds detected python or python3 path
    /// * `main_py_path` - A PathBuf that holds main.py file path
    /// * `requirement_path` - A PathBuf that holds requirements.txt file path
    /// * `main_windows` - A Ref Window that holds main window
    /// * `splash_window` - A Ref Window that holds splashscreen window
    ///
    pub fn create_or_start_server(
        python_path: PathBuf,
        main_py_path: PathBuf,
        mut store: Store<Wry>,
        requirement_path: PathBuf,
        main_windows: &Window,
        splash_window: &Window,
    ) {
        if store.is_empty() {
            if install_python_dependencies(&python_path, requirement_path, store).is_ok() {
                let _ = start_python_server(python_path, main_py_path);
            }
        } else {
            let _ = start_python_server(python_path, main_py_path);
        }
        splash_window.close().unwrap();
        main_windows.show().unwrap();
    }
}
