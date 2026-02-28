import { CalendarEvent } from "./types";

function safeDate(dateStr: string): Date {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date();
  return d;
}

function formatICSDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const h = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}T${h}${min}${s}Z`;
}

function escapeICS(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function generateICSContent(events: CalendarEvent[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Samur.ai//Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const event of events) {
    const start = safeDate(event.startDate);
    let end: Date;

    if (event.endDate) {
      end = safeDate(event.endDate);
    } else if (event.dueDate) {
      end = safeDate(event.dueDate);
    } else {
      end = new Date(start);
      end.setHours(end.getHours() + 1);
    }

    // If end is same as start or before start, add 1 hour
    if (end.getTime() <= start.getTime()) {
      end = new Date(start);
      end.setHours(end.getHours() + 1);
    }

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${event.id}@samurai`);
    lines.push(`DTSTART:${formatICSDate(start)}`);
    lines.push(`DTEND:${formatICSDate(end)}`);
    lines.push(`SUMMARY:${escapeICS(event.title)}`);
    if (event.location) {
      lines.push(`LOCATION:${escapeICS(event.location)}`);
    }
    if (event.notes) {
      lines.push(`DESCRIPTION:${escapeICS(event.notes)}`);
    }
    lines.push(`CATEGORIES:${event.type.toUpperCase()}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICS(events: CalendarEvent[], courseName: string) {
  const content = generateICSContent(events);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${courseName.replace(/\s+/g, "_")}_events.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
