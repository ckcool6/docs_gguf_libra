---
sidebar_position: 2
sidebar_label: 2.运行gguf-libra
title: 2.运行gguf-libra
---

## 运行gguf-libra
解压 GGUF-Libra 的压缩包到任意文件夹，进入release目录，可以用tabby打开这个路径，在此路径下输入：

```powershell
.\gguf-libra.exe 
```

即可启动gguf-libra客户端，端口默认为8099，如果是 `.\gguf-libra.exe -port 0`命令，会开启随机端口。当然`-port`也可以指定端口。

## 打开UI

运行成功后 会显示 `Server started, please open in browser: http://127.0.0.1:8099` ，在浏览器或者tabby的浏览器插件里输入 `http://127.0.0.1:8099`即可打开UI。

## 点击右上角的设置按钮

`API Endpoint URL` 输入启动的8021服务端url，为 `http://127.0.0.1:8021/v1/chat/completions`

`Embedding API Endpoint URL` 输入启动的8022服务端url,为 `http://127.0.0.1:8022/v1/embeddings`

`api key` 留空


## 检察左上角的红灯是否变绿
变绿就连接成功了。随便输入点东西看模型是否有响应。

