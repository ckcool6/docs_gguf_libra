---
sidebar_position: 3
sidebar_label: 3.操作指南
title: 3.操作指南
---

在每次新消息气泡下面都会挂5个按钮，

- switch to main
- side chat
- summary
- merge
- checkpoint main

`summary`的作用：

我们设想这么一个场景，比如CTX设置为16384 tokens,跟角色聊天聊的正嗨，tokens快超过16384了，这时候我们可以点击summary按钮，等待几秒（取决于硬件性能），就会生成一个黄色的总结框，里面是模型总结的你们的对话内容，当然你可以编辑这个内容，如果你不满意的话。那可能有人会好奇，如果我不点击summary会发生什么呢，不点击summary将会触发截断聊天内容，只保留最近的几条对话。虽然这样也可以聊下去，但是最近的几条对话并不代表这16384 tokens里的核心信息，所以触发这个算法是有问题的，所以快到ctx上限的时候，手动触发summary，让模型总结对话，或者你觉得总结的不满意，你可以手动修改这个summary内容。


`checkpoint main`:

对话默认是在main主线上进行的，当你点击了summary生成总结后，点击checkpoint main才会生效，直接点击checkpoint main是不行的，因为还没有summary生成。checkpoint main的意义就是把16384瞬间清空，只保留summary内容。这样接着聊下去的话，模型是记得summary里面的内容，而不是记最近几条对话的内容。

`side chat`:

比如对话进行了3个主线节点了，感觉要有一些分支剧情，或者，你想聊点别的事，别让模型带着记忆聊下去。我们可以点击side chat，会弹出两个选项 with summary 和 isolated sandbox。如果选择isolated sandbox，模型将不会携带第三个节点总结的记忆聊天，它就是一个全新的无记忆的状态，你跟它聊啥它都不知道主线发生了什么。如果选择with summary选项，它就携带第三个节点的summary内容记忆来聊下去，这个东西很适合做if线。如果你觉得这个side chat聊烂了，点击`switch to main`，回到主线，模型将不会记得侧线的聊天内容。如果你觉得side chat 聊的挺好，点击`merge`，会把侧线最后一个节点的summary内容嫁接到主线节点上，同时会物理删除侧线节点，只保留侧线最后一个节点的summary。被删除的侧线消息会以一个绿色的提示框挂在主线气泡上，点击即可看到侧线聊天内容，实际上，此时的链已经不再是树了，而是一个单链。


## 为什么要设计这个东西呢

这个设计听起来好像switch to main更重要一些，它并不删除什么。是的，这就是我核心的意图---试错。在真实的作家写作的过程中，试错的次数远远多于merge的次数，不断地试错，很少merge。通常情况下merge的话，在进入分支前就得想好要干嘛，但是人的思维并不是这样运作的，我们大部分时间是不知道自己在干嘛。

