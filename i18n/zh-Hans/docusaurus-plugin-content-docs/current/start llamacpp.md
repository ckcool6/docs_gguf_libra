---
sidebar_position: 1
sidebar_label:  1.安装 llama cpp 服务端
title:  1.安装 llama cpp 服务端
---

## 下载模型gguf文件 和 llamac cpp

下载llamacpp:
https://github.com/ggml-org/llama.cpp/releases
下载后，假设把它安装在 `D:\llama_cpp`,在 `D:\llama_cpp`里创建 `models` 文件夹，在这里面放模型文件。

下载模型gguf文件：
比如，下载 https://huggingface.co/unsloth/gemma-4-E4B-it-GGUF 里的 `gemma-4-E4B-it-Q5_K_M.gguf`文件，并同时下载里面的 `mmproj-F16.gguf`。我们可以把它重命名为`gemma-4-e4b-mmproj-F16.gguf`。

下载embedding模型：
比如，这里我使用https://huggingface.co/ggml-org/embeddinggemma-300m-qat-q8_0-GGUF

## 安装tabby

虽然浏览器也可以运行 `gguf-libra`，但是为了体验更好一些，我推荐使用 `tabby`,因为Windows terminal的体验太差。tabby本身就是个浏览器，在tabby的插件市场里搜索 `browser` 安装 browser 插件。

## 双启动脚本

打开tabby，左右分割窗口，创建脚本1 `start gemma.ps1`并运行：

```powershell
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
    --repeat-penalty 1.15 `
```

创建脚本2 `embedding.ps1`并运行:

```powershell
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

现在双服务端已启动，主模型为`8021`，embedding模型为`8022`


