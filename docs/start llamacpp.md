---
sidebar_position: 1
sidebar_label: 1. Setup llama.cpp Server
title: 1. Setup llama.cpp Server
---

## Download llama.cpp and GGUF Models

Download llama.cpp:
Grab it from: https://github.com/ggml-org/llama.cpp/releases
Let's say you unzip it to `D:\llama_cpp`. Create a `models` folder inside `D:\llama_cpp` to hold your model files.


Download GGUF Chat Model:
For example, download `gemma-4-E4B-it-Q5_K_M.gguf` from https://huggingface.co/unsloth/gemma-4-E4B-it-GGUF, along with `mmproj-F16.gguf`. You can rename it to `gemma-4-e4b-mmproj-F16.gguf`.


Download Embedding Model:
For embeddings, you can use something like:
https://huggingface.co/ggml-org/embeddinggemma-300m-qat-q8_0-GGUF


## Install Tabby

You can just use a normal browser, but for a much smoother experience, I recommend using `Tabby` (Windows Terminal feels pretty clunky). Tabby actually has a built-in browser. Just search for `browser` in Tabby's plugin marketplace and install it.

## Dual Startup Scripts

Open Tabby, split the window side-by-side, create Script 1 `start gemma.ps1`, and run it:

```Powershell
Set-Location -Path "D:\llama_cpp"
$Host.UI.RawUI.WindowTitle = 'LLaMA - Main Model (Port: 8021)'
Write-Host "Starting LLaMA Server on port 8021..." -ForegroundColor Yellow

.\llama-server.exe `
    -m "D:\llama_cpp\models\gemma-4-E4B-it-Q5_K_M.gguf" `
    --mmproj "D:\llama_cpp\models\gemma-4-e4b-mmproj-F16.gguf" `
    -ngl 99 `
    -c 32768 `
    --port 8021 `
    --host 0.0.0.0 `
    --cache-ram 512 `
    --cache-type-k q8_0 `
    --cache-type-v q8_0 `
    --keep 0 `
    -fa on `
    -np 1 `
    --reasoning off `
    --repeat-penalty 1.15
```
Create Script 2 `embedding.ps1` and run it:

```Powershell
Set-Location -Path "D:\llama_cpp"
$Host.UI.RawUI.WindowTitle = 'LLaMA - Embedding (Port: 8022)'
Write-Host "Starting Embedding Service on port 8022..." -ForegroundColor Cyan

.\llama-server.exe `
    -m "models\embeddinggemma-300M-Q8_0.gguf" `
    -ngl 0 `
    -c 2048 `
    -b 2048 `
    -ub 2048 `
    --port 8022 `
    --host 0.0.0.0 `
    --embedding `
    --pooling mean
```
Now your dual servers are live: the main chat model runs on port `8021`, and the embedding model runs on port `8022`.

