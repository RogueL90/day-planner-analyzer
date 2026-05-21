# Day Planner Analyzer

See how you really spend your days. This plugin reads your Day Planner-style daily notes and shows completion rates, unplanned time, trends, and a built-in assistant to help you plan better.

Works alongside the [Day Planner](https://github.com/ivan-lednev/obsidian-day-planner) plugin — it does not replace your timeline; it adds a stats view on top of the notes you already write.

- [Report bugs or request features](https://github.com/RogueL90/obsidian-day-planner-analyzer/issues)
- [Submit a pull request](https://github.com/RogueL90/obsidian-day-planner-analyzer)

> Your daily notes should be named like **`2026-02-23.md`** (year-month-day). The plugin finds these files anywhere in your vault.

## What it does

- Reads time-boxed tasks from your daily notes and keeps stats up to date as you edit
- Shows how many days you planned, how long your days run, and how much time was left unplanned
- Tracks how often you finish tasks — especially ones you mark as priority
- Lets you pick a week, a month, or any custom date range
- Includes a chat assistant that gives advice based on your stats (no API key needed)
- Charts how much time you spend on a task over time
- Lists each day and each task in simple tables you can sort

## Install

**From Community Plugins** (when available): Settings → Community plugins → search **Day Planner Analyzer** → Install → Enable.

**Manual install:** Copy `main.js`, `styles.css`, and `manifest.json` into `.obsidian/plugins/odpa/` in your vault, reload Obsidian, then enable the plugin.

## How to use

### Open the stats window

Press `Ctrl/Cmd + P`, type **Advanced statistics**, and run the command.

**Screenshot:** Command palette with “Advanced statistics” highlighted.

---

### Write your day (daily note format)

Plan your day as normal checklist lines with a start time, an end time, and a task name. Use the Day Planner plugin or write directly in a note named `2026-02-23.md`.

Example:

```markdown
# Day planner

- [ ] 9:00am - 9:30am Morning routine
- [x] 10:00am - 11:00am* Deep work // focus block
```

**General rules**

- One task per line, with times on the left: `9:00am - 10:00am Task name`
- Check the box `[x]` when you finish a task
- Add a `*` after the **end** time for a priority task: `11:00am* Important meeting`
- Add `//` after the name for a note that should not count as part of the task name

**Screenshot:** A daily note in the editor with several time-boxed tasks, including one checked off and one marked with `*`.

Tap **Info** inside the stats window anytime for a quick reminder of these rules.

---

### The stats window

**Screenshot:** Full Advanced statistics modal — header, summary cards, tabs, assistant on the left, chart on the right, tables below.

#### Pick a time range

Use the tabs at the top: **Past 7 days**, **Past 30 days**, or **Custom**.

For Custom you can look at the last N days, pick a start and end date, or view **all time**.

**Screenshot:** The three time-range tabs, with “Past 7 days” selected.

**Screenshot:** Custom tab with “Past N days”, “Between dates”, and “All time” options and the green Calculate button.

#### Summary cards

At the top you’ll see quick numbers for the range you chose: how many days were analyzed, your typical day length, average unplanned time, and how often you complete priority tasks vs all tasks.

**Screenshot:** Row of summary cards (Days analyzed, Avg day length, Avg unplanned/idle time, Priority completion, Task completion).

Stats update when you change your daily notes. **Last updated** in the header shows when the plugin last read your files.

#### Productivity assistant

Ask things like what to focus on today, how to reduce gaps in your schedule, or how to finish more priority tasks. The assistant only uses the summary for the range you have open — not your full note text.

You can expand the chat, clear the conversation, or change the model in settings. Chat history is saved until you clear it.

**Screenshot:** Assistant panel with a short example question and reply.

**Screenshot:** Expanded assistant view (full-width chat).

#### Tasks graph

Choose a task from the dropdown to see how many hours you spent on it each day in your selected range.

**Screenshot:** Tasks graph with the dropdown open and a line chart for one task.

#### Daily breakdown

A day-by-day table: when your day started and ended, priority tasks done, and how many tasks you planned vs completed.

**Screenshot:** Daily breakdown table with a few rows and the “Show more” control.

#### Tasks breakdown

See which tasks took the most time overall and when you last did each one.

**Screenshot:** Tasks breakdown table sorted by time spent.

---

## Settings

Settings → **Day Planner Analyzer**

- **Chat model** — which AI model the assistant uses
- **Clear assistant chat history** — start a fresh conversation

**Screenshot:** Plugin settings with Chat model dropdown and Clear chat button.

## Good to know

- Only notes named `YYYY-MM-DD.md` are included
- Lines that don’t follow the time-range format are skipped
- This plugin shows stats only — it does not edit your schedule
- The assistant needs internet access and only sees summary numbers, not your full notes
- If two tasks overlap in time, unplanned time is calculated as if they were one block

## For developers

Clone the repo into `.obsidian/plugins/odpa/`, run `npm i` and `npm run dev`, then reload Obsidian. See [Obsidian’s plugin docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin) for more.

## Acknowledgements

Built for users of the [Day Planner](https://github.com/ivan-lednev/obsidian-day-planner) plugin. Charts use [Chart.js](https://www.chartjs.org/).
