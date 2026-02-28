import { createEvents, type DateArray } from "ics";
import { saveAs } from "file-saver";
import { CalendarEvent } from "./types";

function toDateArray(dateStr: string): DateArray {
  const d = new Date(dateStr);
  return [
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
  ];
}

export function downloadICS(events: CalendarEvent[], courseName: string) {
  const icsEvents = events.map((e) => {
    const start = toDateArray(e.startDate);
    const end = e.endDate
      ? toDateArray(e.endDate)
      : e.dueDate
        ? toDateArray(e.dueDate)
        : undefined;

    if (end) {
      return {
        title: e.title,
        start,
        end,
        location: e.location || undefined,
        description: e.notes || undefined,
        categories: [e.type] as string[],
      };
    }

    return {
      title: e.title,
      start,
      duration: { hours: 1 } as const,
      location: e.location || undefined,
      description: e.notes || undefined,
      categories: [e.type] as string[],
    };
  });

  const { error, value } = createEvents(icsEvents);
  if (error || !value) {
    console.error("ICS generation error:", error);
    alert("Failed to generate calendar file.");
    return;
  }

  const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
  saveAs(blob, `${courseName.replace(/\s+/g, "_")}_events.ics`);
}
