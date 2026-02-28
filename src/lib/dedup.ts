import { CalendarEvent } from "./types";

export function deduplicateEvents(events: CalendarEvent[]): CalendarEvent[] {
  const seen = new Set<string>();
  return events.filter((e) => {
    const key = `${e.title.toLowerCase().trim()}|${e.startDate}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
