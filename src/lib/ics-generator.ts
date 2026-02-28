import { createEvents, EventAttributes } from "ics";
import { saveAs } from "file-saver";
import { CalendarEvent } from "./types";

export function downloadICS(events: CalendarEvent[], courseName: string) {
  const icsEvents: EventAttributes[] = events.map((e) => {
    const start = new Date(e.startDate);
    const startArray: [number, number, number, number, number] = [
      start.getFullYear(),
      start.getMonth() + 1,
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
    ];

    const attrs: EventAttributes = {
      title: e.title,
      start: startArray,
      location: e.location || undefined,
      description: e.notes || undefined,
      categories: [e.type],
    };

    if (e.endDate) {
      const end = new Date(e.endDate);
      attrs.end = [
        end.getFullYear(),
        end.getMonth() + 1,
        end.getDate(),
        end.getHours(),
        end.getMinutes(),
      ];
    } else if (e.dueDate) {
      const due = new Date(e.dueDate);
      attrs.end = [
        due.getFullYear(),
        due.getMonth() + 1,
        due.getDate(),
        due.getHours(),
        due.getMinutes(),
      ];
    } else {
      attrs.duration = { hours: 1 };
    }

    return attrs;
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
