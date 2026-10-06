---
sidebar_position: 2
sidebar_label: 安装
title: 安装
---

# 站点构建与部署指南

本文档将介绍如何在本地运行开发服务器，以及如何将站点编译打包为生产环境可用的静态文件。

## 1. 本地启动

在项目根目录下打开终端，执行以下命令即可启动热重载开发服务器：

```bash
# 安装依赖
npm install

# 启动本地服务
npm run start
```

```javascript
const greeting = "Hello World";
function sayHi(user) {
  console.log(`${greeting}, ${user}!`);
  return true;
}
```