---
sidebar_position: 4
sidebar_label: 4. What data.bin Does
title: 4. What data.bin Does
---

## Command Overview
The data.bin file is GGUF-Libra’s database. It doesn’t store raw chat logs; it only stores summary chains.In the bottom-right corner of the UI, there's a terminal icon. Clicking it opens parser.exe, a TUI (terminal) tool built specifically to manage data.bin.

Type help, and you'll see:
`clear` `cls` `data` `exit` `export` `help` import save status
You can ignore clear, cls, exit, and help.
You only need to care about: `data`, `export`, `import`, `save`, and `status`.

data: View all stored summary chains. Run data 3 for the first 3, or data n for the first n.

export: Dumps the binary content of data.bin into readable exported_records.json so you can view or tweak it.

import: Loads `exported_records.json` back into data.bin.

save: Takes the summaries from chain_history.json, runs them through our ranking algorithm, and saves them into data.bin.

status: Checks the size of `chain_history.json`. (`chain_history.json` is basically runtime residue left behind by the Go app—you shouldn't touch it manually).

## Why is this useful?

Imagine you just finished an awesome chat. Sure, you could export it as a .txt file, but then only you remember it—the model learned nothing.
Instead, open parser.exe and run save. It extracts the summaries from `chain_history.json`, structures them, and commits them to data.bin. Type data, and you'll see them safely stored. (export and import are just there so you can easily back things up).

## Does the model actually remember it?

Not necessarily.

Whenever a summary chain is saved, it gets assigned a weight called `logicT`. The chains inside data.bin are sorted by this value. When the Go backend queries data.bin, it doesn't search everything—it only dynamically searches the top 15% of summary chains.Why not search the whole thing? Because the whole philosophy here is weight: logicT weighs your conversations. Heavy thoughts stick around; lightweight ones are forgotten. Think of it like PageRank for memories.So no, the model won't keep everything forever—it intentionally forgets. As conversations pile up, more and more trivial stuff fades away. What stays behind with a high logicT score is true human-AI sediment—the stuff that actually mattered.

## What’s the bigger picture here?

Beyond intentional forgetting, there's another cool aspect: sharing.
If someone shares their data.bin with you, it's basically like sharing a game mod. When you load someone else's data.bin, you're loading their worldview and way of thinking—not just the base LLM's generic response style. Because if we follow Transformer math to its logical conclusion, every base model in the world eventually starts sounding the exact same. This gives it character.



