# Day Planner Analyzer

Turn your Day Planner daily notes into actionable insights — completion rates, idle time, trends over time, and an in-app productivity assistant.

- [Report bugs and suggest features](https://github.com/RogueL90/obsidian-day-planner-analyzer/issues)
- [Ask questions](https://github.com/RogueL90/obsidian-day-planner-analyzer/issues)
- [Submit pull requests](https://github.com/RogueL90/obsidian-day-planner-analyzer)

**Day Planner Analyzer** is a community plugin for [Obsidian](https://obsidian.md). It analyzes schedules you write in a [Day Planner](https://github.com/ivan-lednev/obsidian-day-planner)-style workflow: time-boxed checklist lines in daily notes. It does not replace Day Planner’s timeline UI; it complements it with retrospective analytics so you can see how you actually spent your time and where to improve.

> **Note:** Daily note files must be named `YYYY-MM-DD.md` (for example `2026-02-23.md`) anywhere in your vault. The plugin scans all matching markdown files automatically.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [How to use](#how-to-use)
- [Daily note format](#daily-note-format)
- [Understanding your stats](#understanding-your-stats)
- [Settings](#settings)
- [Limitations](#limitations)
- [Development](#development)
- [Acknowledgements](#acknowledgements)

## Features

- **Automatic analysis** — Scans every `YYYY-MM-DD.md` file in your vault and refreshes when daily notes are created, edited, renamed, or deleted.
- **Summary at a glance** — Days analyzed, average day length (start to end), average unplanned/idle time, priority task completion rate, and overall task completion rate.
- **Flexible time ranges** — Past 7 days, Past 30 days, or Custom (past N days, between two dates, or all-time lifetime stats).
- **Productivity assistant** — Chat about your schedule using the stats in the current view. Powered by [llm7.io](https://llm7.io); no API key required. Choose the model in settings; conversation history is saved across sessions.
- **Tasks graph** — Line chart of how many hours you spent on a selected task each day in the range.
- **Daily breakdown** — Sortable table per day: date, start/end, priority tasks completed, planned vs completed counts.
- **Tasks breakdown** — Sortable rollup by task name: total time spent and last performed date.
- **In-app guidelines** — Open the **Info** panel in the stats modal for formatting reminders.

## Installation

### From Community Plugins (when listed)

1. Open **Settings → Community plugins**.
2. Browse and search for **Day Planner Analyzer**.
3. Install and enable the plugin.

### Manual install

1. Copy `main.js`, `styles.css`, and `manifest.json` into your vault folder:  
   `VaultFolder/.obsidian/plugins/odpa/`
2. Reload Obsidian (**Settings → Community plugins → Reload** or restart the app).
3. Enable **Day Planner Analyzer** under Community plugins.

## How to use

### Open the analyzer

Run the command **Advanced statistics** from the command palette (`Ctrl/Cmd + P`).

There is no ribbon icon; the command palette is the entry point.

### What you need first

Write your day as time-boxed tasks in daily notes named `YYYY-MM-DD.md`. The plugin works best alongside the Day Planner community plugin, but any note that follows the format below is supported.

## Daily note format

Each schedulable line is a checkbox task with a **time range**, then the task name:

```markdown
# Day planner

- [ ] 9:00am - 9:30am Morning routine
- [x] 10:00am - 11:00am* Deep work // focus block
```

### Formatting rules

| Rule | Example |
|------|---------|
| Time range | `9:00am - 9:30am` or `14:00 - 15:30` |
| 12-hour times | `9am`, `9:30am`, `2pm`, `12:00pm` |
| 24-hour times | `14:00`, `14:30` |
| Compact military | `930` → 9:30, `1430` → 14:30 |
| Priority task | Asterisk on the **end** time: `11:00am* Task name` |
| Comment (ignored in stats name) | `//` after the task: `Meditate // with music` |
| Completed | `[x]` in the checkbox |

Lines that do not match this pattern are skipped. Malformed time ranges are ignored for that line.

You can also open **Info** inside the Advanced statistics modal for the same guidelines.

## Understanding your stats

After you run **Advanced statistics**, choose a time range with the tabs at the top.

### Summary cards

| Card | Meaning |
|------|---------|
| **Days analyzed** | Number of daily notes in the selected range |
| **Avg day length** | Average earliest start to latest end across those days |
| **Avg Unplanned/idle time** | Average minutes per day not covered by planned blocks (gaps within your day’s span; overlapping blocks are merged) |
| **Priority task completion rate** | Share of priority tasks (marked with `*` on end time) that are checked off |
| **Task completion rate** | Share of all planned tasks that are checked off |

Stats refresh automatically when you edit daily notes. The header shows **Last updated** for the latest scan.

### Time range tabs

- **Past 7 days** — Recent week of daily notes.
- **Past 30 days** — Recent month of daily notes.
- **Custom** — Choose one of:
  - **Past N days** — Enter a number and press **Calculate stats**.
  - **Between dates** — Pick start and end dates.
  - **All time (lifetime stats)** — Every `YYYY-MM-DD.md` file in the vault.

If no daily notes exist in the range, you will see an empty state asking you to widen the range or try all time.

### Productivity assistant

The assistant panel uses only the **aggregated summary** for the stats view you have open (same numbers as the summary cards and tasks breakdown). It does not read full note text or per-day schedules.

- Ask for prioritization, timeboxing, reducing idle gaps, or improving completion on priority tasks.
- **Expand** the chat for a larger view; **Clear** removes history (also available in plugin settings).
- Messages persist across sessions until you clear them.

The assistant requires network access to llm7.io.

### Tasks graph

Select a task from the dropdown. The line chart shows **total hours** spent on that task each day in the current range. The default selection is the task with the most total time in the range.

### Daily breakdown

Per-day table with sortable columns: **Date**, **Start/End**, **Priority Tasks** (completed/total), **Planned**, **Completed**. Use **Show more** when there are more than five days.

### Tasks breakdown

Rollup across the range: **Name**, **Time Spent** (total), **Last Performed**. Sortable; **Show more** when there are more than five tasks.

## Settings

Open **Settings → Day Planner Analyzer** (under Community plugins):

- **Chat model** — `gpt-oss-20b`, `codestral-latest`, or `GLM-4.6V-Flash` for the productivity assistant.
- **Clear assistant chat history** — Remove all saved assistant messages.

## Limitations

- Only `YYYY-MM-DD.md` files are analyzed; other note names are ignored.
- Task lines must use the time-range checkbox format; otherwise they are skipped.
- Analytics are **read-only** — you cannot edit the timeline from this plugin.
- The assistant only sees aggregated stats for the open time range, not raw daily note content.
- The assistant needs an internet connection to llm7.io.
- Overlapping time blocks are treated as a single span when computing idle time.

## Development

To work on the plugin locally:

1. Clone the repository into `.obsidian/plugins/odpa/` (or symlink it there).
2. Install dependencies: `npm i`
3. Start watch mode: `npm run dev`
4. Reload Obsidian to pick up changes to `main.js`.

See the [Obsidian plugin developer docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin) for the full guide. Run `npm run lint` for ESLint checks.

**Releasing:** Bump `version` in `manifest.json`, build with `npm run build`, and attach `manifest.json`, `main.js`, and `styles.css` to a GitHub release. See [Releasing your plugin](https://docs.obsidian.md/Plugins/Releasing/Release+your+plugin+with+GitHub+Actions).

## Acknowledgements

- Built for schedules created with the [Day Planner](https://github.com/ivan-lednev/obsidian-day-planner) community plugin
- Charts powered by [Chart.js](https://www.chartjs.org/)
