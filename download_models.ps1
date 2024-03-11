function Get-Files {
    param (
        [string]$BaseUrl,
        [hashtable]$Files,
        [string]$DestDir
    )

    # Ensure the destination directory exists
    New-Item -ItemType Directory -Force -Path $DestDir | Out-Null

    # Loop through the hashtable and download each file
    foreach ($remote_file in $Files.GetEnumerator()) {
        $local_file = $remote_file.Value
        $download_url = "$BaseUrl/$($remote_file.Name)"
        $destination_path = Join-Path -Path $DestDir -ChildPath $local_file
        Write-Host "Downloading $($remote_file.Name) to $destination_path"
        Invoke-WebRequest -Uri $download_url -OutFile $destination_path -UseBasicParsing
    }
}

# Base URLs for the files
$BASE_URL_CAPTION = "https://huggingface.co/pasindu/blip-image-captioning-base-finetuned/resolve/main"
$BASE_URL_EXPCAPTION = "https://huggingface.co/pasindu/image_captioning_cnn_rnn/resolve/main"
$BASE_URL_IMAGE = "https://huggingface.co/google/vit-base-patch16-224-in21k/resolve/main"
$BASE_URL_TEXT = "https://huggingface.co/sentence-transformers/multi-qa-MiniLM-L6-cos-v1/resolve/main"

# Destination directories
$DEST_DIR_CAPTION = "./engine/AI/model-caption"
$DEST_DIR_EXPCAPTION = "./engine/AI/model-exp-caption"
$DEST_DIR_IMAGE = "./engine/AI/model-image"
$DEST_DIR_TEXT = "./engine/AI/model-text"

# Declare hashtables for files to download
$files_caption = @{
    "config.json?download=true"              = "config.json"
    "preprocessor_config.json?download=true" = "preprocessor_config.json"
    "pytorch_model.bin?download=true"        = "pytorch_model.bin"
    "special_tokens_map.json?download=true"  = "special_tokens_map.json"
    "tokenizer.json?download=true"           = "tokenizer.json"
    "tokenizer_config.json?download=true"    = "tokenizer_config.json"
    "vocab.txt?download=true"                = "vocab.txt"
}

$files_expcaption = @{
    "decoder.pkl?download=true" = "decoder.pkl"
    "encoder.pkl?download=true" = "encoder.pkl"
    "vocab.pkl?download=true"   = "vocab.pkl"
}

$files_image = @{
    "config.json?download=true"              = "config.json"
    "preprocessor_config.json?download=true" = "preprocessor_config.json"
    "pytorch_model.bin?download=true"        = "pytorch_model.bin"
}

$files_text = @{
    "config_sentence_transformers.json?download=true" = "config_sentence_transformers.json"
    "config.json?download=true"                       = "config.json"
    "data_config.json?download=true"                  = "data_config.json"
    "modules.json?download=true"                      = "modules.json"
    "pytorch_model.bin?download=true"                 = "pytorch_model.bin"
    "sentence_bert_config.json?download=true"         = "sentence_bert_config.json"
    "special_tokens_map.json?download=true"           = "special_tokens_map.json"
    "tokenizer_config.json?download=true"             = "tokenizer_config.json"
    "tokenizer.json?download=true"                    = "tokenizer.json"
    "vocab.txt?download=true"                         = "vocab.txt"
}

# Download files for model-caption
Write-Host "Downloading model-caption files..."
Get-Files -BaseUrl $BASE_URL_CAPTION -Files $files_caption -DestDir $DEST_DIR_CAPTION

# Download files for model-exp-caption
Write-Host "Downloading model-exp-caption files..."
Get-Files -BaseUrl $BASE_URL_EXPCAPTION -Files $files_expcaption -DestDir $DEST_DIR_EXPCAPTION

# Download files for model-image
Write-Host "Downloading model-image files..."
Get-Files -BaseUrl $BASE_URL_IMAGE -Files $files_image -DestDir $DEST_DIR_IMAGE

# Download files for model-text
Write-Host "Downloading model-text files..."
Get-Files -BaseUrl $BASE_URL_TEXT -Files $files_text -DestDir $DEST_DIR_TEXT

Write-Host "Download completed."