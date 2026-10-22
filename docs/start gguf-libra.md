---
sidebar_position: 2
sidebar_label: 2. Running GGUF-Libra
title: 2. Running GGUF-Libra
---

## Launch GGUF-Libra
Unzip the GGUF-Libra archive anywhere you like, head into the release folder (you can open this folder directly inside Tabby), and run:

```Powershell
.\gguf-libra.exe
```
This launches the client on the default port 8099. If you run `.\gguf-libra.exe -port 0`, it'll pick a random port instead. You can also specify any port you want with `-port`.

## Open the UI
Once it starts, you'll see:
`Server started, please open in browser: http://127.0.0.1:8099`
Just paste http://127.0.0.1:8099 into your browser or Tabby's browser tab.

## Click Settings (Top-Right Gear Icon)

`API Endpoint URL`: Set to your chat server: `http://127.0.0.1:8021/v1/chat/completions`
`Embedding API Endpoint URL`: Set to your embedding server: `http://127.0.0.1:8022/v1/embeddings`
`API Key`: Leave it blank.


## Check the Status Light (Top-Left)
If the red light turns green, you're connected! Type a quick message to see if the model responds.



