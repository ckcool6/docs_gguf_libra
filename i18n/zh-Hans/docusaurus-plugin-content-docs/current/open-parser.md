---
sidebar_position: 4
sidebar_label: 4.data.bin的作用
title: 4.data.bin的作用
---

## 命令介绍
data.bin文件是gguf-libra的数据库，当然它并不存储对话内容，它只存储summary链，在UI上右下角有个命令行图标的按钮，点击就可打开parser.exe，这是一个TUI程序，它的作用就是管理data.bin。

打开输入help命令，可以看到显示 clear  cls  data  exit  export  help  import  save  status 这几个命令。

clear cls exit help不用管

只需要看data export import save status 命令即可

输入data命令查看全部存储的summary链，输入data 3 看前3条，输入data n看前n条

输入export命令会把data.bin里的二进制内容转为exported_records.json，可以打开查看，或修改。

输入import命令会把`exported_records.json`录入到data.bin 

输入 status 查看`chain_history.json`的大小。`chain_history.json`是go程序运行过程中的排泄物，不推荐手动打开修改它。

## 这有啥用

我们设想这样一个场景，你跟模型聊的挺爽，当然可以点击导出为txt保存聊天记录，但是这样做只有你自己记住了，模型并没有记住什么。这时候我们可以打开parser.exe，输入save,会把 `chain_hitory.json`的内容，经过特定的算法存到data.bin里，实际上这个算法是把`chain_history.json`里的summary内容提取出来，然后结构化的存进去了。然后接着输入data,就可以看到已经入库。其实这俩命令就够了，之所以设计一个export和import，是为了方便备份。

## 它真的记住了吗

不一定，被存入的summary链，会通过特定算法计算`logicT`，在入库之前就会计算这个东西。所以data.bin里的summary链是按logicT排序的，go程序会搜索data.bin,但不是全量搜索，而是动态搜索排在最前面的百分之十五范围内的summary链。为什么我不弄个全量搜索，原因就是在我的设计里，通过logict计算对话的重量，来判断哪个对话是沉重的，然后遗忘掉轻盈的。这类似搜索引擎的PageRank，判断哪个是重要的。所以它不一定就记住了，而是会遗忘掉，随着对话的积累，可能遗忘的越多。留下来的logicT大的就是人机沉淀物。

## 这个设计的意义是什么

这个设计的意义除了遗忘之外，还有就是，假如有人愿意分享data.bin的话，这相当于某种游戏mod。我加载了别人的data.bin，相当于加载了他的世界观，看看他的想法是啥，而不是看看大模型的想法。因为全世界的大模型最终会变得一样，按transformer的数学原理运作下去的话。