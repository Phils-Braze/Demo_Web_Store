import fs from "node:fs";
import path from "node:path";

// Usage: node scripts/extract-gtm-events.mjs <tag-assistant-export.json> [out.md]
// Summarises a Tag Assistant export: dataLayer events + keys, tags fired, variables.
const [input, output = "gtm-setup.md"] = process.argv.slice(2);
if (!input) {
  console.error("Usage: node scripts/extract-gtm-events.mjs <export.json> [out.md]");
  process.exit(1);
}

const exported = JSON.parse(fs.readFileSync(input, "utf8"));
const containers = exported.data?.containers ?? [];

const preview = (v) => {
  const s = typeof v === "string" ? v : JSON.stringify(v);
  return s.length > 80 ? `${s.slice(0, 77)}...` : s;
};

const lines = ["# GTM setup summary", "", `Source: \`${path.basename(input)}\``, ""];

for (const c of containers) {
  const events = new Map();
  const tags = new Map();
  const variables = new Map();

  for (const m of c.messages ?? []) {
    for (const t of m.tagInfo ?? []) {
      tags.set(t.displayName, { type: t.type, events: new Set([...(tags.get(t.displayName)?.events ?? []), m.eventName]) });
    }
    for (const v of m.macroInfo ?? []) {
      const name = v.name ?? v.displayName;
      if (name) variables.set(name, v.variableType ?? "");
    }
    if (!m.eventName || m.eventName.startsWith("gtm.")) continue;

    const entry = events.get(m.eventName) ?? { count: 0, params: new Map() };
    entry.count += 1;
    for (const [k, v] of Object.entries(m.message ?? {})) {
      if (k === "event" || k.startsWith("gtm.")) continue;
      if (!entry.params.has(k)) entry.params.set(k, preview(v));
    }
    events.set(m.eventName, entry);
  }

  lines.push(`## Container ${c.publicId}`, "");

  lines.push("### Triggers (Custom Event, one per dataLayer event)", "");
  lines.push("| Event name | Seen | Params |", "|---|---|---|");
  for (const [name, e] of events) {
    lines.push(`| \`${name}\` | ${e.count} | ${[...e.params.keys()].map((k) => `\`${k}\``).join(", ") || "-"} |`);
  }

  lines.push("", "### Data Layer Variables (name → sample value)", "");
  lines.push("| Key | Sample | Events |", "|---|---|---|");
  const byKey = new Map();
  for (const [name, e] of events) {
    for (const [k, sample] of e.params) {
      const row = byKey.get(k) ?? { sample, events: [] };
      row.events.push(name);
      byKey.set(k, row);
    }
  }
  for (const [k, row] of byKey) {
    lines.push(`| \`${k}\` | \`${row.sample.replace(/\|/g, "\\|")}\` | ${row.events.join(", ")} |`);
  }

  lines.push("", "### Tags fired", "");
  for (const [name, t] of tags) lines.push(`- ${name} (${t.type}) on: ${[...t.events].join(", ")}`);

  lines.push("", "### Variables resolved in preview", "");
  for (const [name, type] of variables) lines.push(`- ${name}${type ? ` (${type})` : ""}`);
  lines.push("");
}

fs.writeFileSync(output, lines.join("\n"));
console.log(`Wrote ${output}`);
