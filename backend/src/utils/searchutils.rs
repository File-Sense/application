/*
* Reference
* @web_page {,
*   title = {conaticus/FileExplorer: Fast file explorer written with Tauri and React.},
*   url = {https://github.com/conaticus/FileExplorer},
* }
*/

use std::path::Path;

use fuzzy_matcher::{skim::SkimMatcherV2, FuzzyMatcher};

use crate::{DirectoryChild, MIN_SCORE};

pub fn score_f_name(f_name: &str, keyword: &str, matcher: &SkimMatcherV2) -> i16 {
    if f_name == keyword {
        return 1000;
    }
    matcher.fuzzy_match(f_name, keyword).unwrap_or(0) as i16
}

pub fn passed_extension(f_name: &str, extension: &String) -> bool {
    if extension.is_empty() {
        return true;
    }
    f_name.ends_with(extension.as_str())
}

pub fn check_file(
    f_name: &String,
    f_path: &String,
    extension: &String,
    keyword: String,
    matcher: &SkimMatcherV2,
    accept_files: bool,
    results: &mut Vec<DirectoryChild>,
    fuzzy_scores: &mut Vec<i16>,
) {
    if !accept_files {
        return;
    }
    if !passed_extension(f_name, extension) {
        return;
    }

    let f_name_path = Path::new(f_name);
    let cleaned_f_name = f_name_path
        .file_stem()
        .and_then(|stem| stem.to_str())
        .unwrap_or("");

    let score = score_f_name(cleaned_f_name, keyword.as_str(), matcher);

    if score < MIN_SCORE {
        return;
    }

    results.push(DirectoryChild::File(f_name.to_string(), f_path.to_string()));
    fuzzy_scores.push(score);
}
