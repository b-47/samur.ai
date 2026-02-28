import { CalendarEvent } from "./types";

function safeDate(dateStr: string): Date {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return new Date(); // fallback to now
  }
  return d;
}

function formatDateCompact(dateStr: string): string {
  const d = safeDate(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function formatDateTimeCompact(dateStr: string): string {
  const d = safeDate(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${y}${m}${day}T${h}${min}${s}`;
}

function addDays(dateStr: string, days: number): string {
  const d = safeDate(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function getEndDate(event: CalendarEvent): string {
  return event.endDate || event.dueDate || addDays(event.startDate, event.isAllDay ? 1 : 0);
}

export function googleCalendarUrl(event: CalendarEvent, timezone: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.notes || "",
    location: event.location || "",
    ctz: timezone,
  });

  if (event.isAllDay) {
    const startStr = formatDateCompact(event.startDate);
    const endStr = formatDateCompact(addDays(event.startDate, 1));
    params.set("dates", `${startStr}/${endStr}`);
  } else {
    const startStr = formatDateTimeCompact(event.startDate);
    const end = getEndDate(event);
    const endStr = formatDateTimeCompact(
      end === event.startDate ? addDays(event.startDate, 0) : end
    );
    if (startStr === endStr) {
      const d = safeDate(event.startDate);
      d.setHours(d.getHours() + 1);
      params.set("dates", `${startStr}/${formatDateTimeCompact(d.toISOString())}`);
    } else {
      params.set("dates", `${startStr}/${endStr}`);
    }
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(event: CalendarEvent): string {
  const startD = safeDate(event.startDate);
  const startDt = startD.toISOString();
  const endDate = getEndDate(event);
  let endDt: string;

  if (endDate === event.startDate && !event.isAllDay) {
    const d = new Date(startD);
    d.setHours(d.getHours() + 1);
    endDt = d.toISOString();
  } else {
    endDt = safeDate(endDate).toISOString();
  }

  const params = new URLSearchParams({
    rru: "addevent",
    subject: event.title,
    body: event.notes || "",
    location: event.location || "",
    startdt: startDt,
    enddt: endDt,
  });

  if (event.isAllDay) {
    params.set("allday", "true");
  }

  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}
