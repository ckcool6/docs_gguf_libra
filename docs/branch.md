---
sidebar_position: 3
sidebar_label: 3. User Guide
title: 3. User Guide
---

Under every new message bubble, you’ll find 5 buttons:

- switch to main
- side chat
- summary
- merge
- checkpoint main


What `summary` does:

Picture this: your context window (CTX) is set to 16,384 tokens. You’re having an awesome chat with your character, but you're about to hit that 16k ceiling.
Click the summary button. Wait a few seconds (depending on your hardware), and a yellow box will pop up. Inside is the model's summary of everything you’ve talked about so far. If you don't like how it phrased something, you can edit it directly.
What happens if you don't click summary? The system will simply chop off older messages and only keep the most recent few. Sure, you can keep chatting, but the last couple of messages don't represent the core story of those 16k tokens. Blind truncation ruins the context. That’s why you want to trigger summary right before hitting the limit—let the model condense the chat, or tweak it yourself.


What `checkpoint main` does:

You always chat on the main branch by default. Once you hit summary and get that yellow box, clicking checkpoint main locks it in. (Clicking it without a summary won't do anything because there's nothing to checkpoint).
What it actually does is wipe those 16k tokens clean in an instant, keeping only the summary. When you keep chatting, the model remembers the concentrated summary rather than just the last two or three random lines.


What `side chat` does:

Say you’re 3 main story nodes in. You feel like exploring a subplot, or you just want to talk about something random without dragging all that baggage along. Click side chat, and you'll get two choices:
isolated sandbox: The model carries zero memory from node 3. It's a completely fresh start. It won't know anything about what happened in the main story.
with summary: The model takes the summary from node 3 along with it. Perfect for exploring "what-if" branch lines.
If the side branch goes nowhere, just hit `switch to main`. You're back on the main road, and the model won't remember a single thing from that side detour.
If the side branch turns out amazing, hit `merge`. This takes the summary from the last node of your side branch, welds it onto your main node, and physically wipes out the side branch messages—leaving behind only that final summary. The deleted side messages will show up as a little green box attached to the main bubble (you can click it anytime to read what happened). Behind the scenes, the tree is flattened back into a clean, single chain.


## Why design it this way?

It might sound like switch to main is the real hero here since it doesn’t delete anything. And yes, that's exactly the point: trial and error.
When real writers write, they throw away ideas way more often than they keep them. We constantly experiment, but rarely merge. To merge cleanly, you usually have to know what you want before you even start. But that's not how human brains work. Most of the time, we have no idea what we're doing—we just want to try things out without messing up the main story.