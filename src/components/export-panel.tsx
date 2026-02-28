"use client";

import { CalendarEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { downloadICS } from "@/lib/ics-generator";
import { googleCalendarUrl, outlookCalendarUrl } from "@/lib/calendar-links";

interface ExportPanelProps {
  events: CalendarEvent[];
  courseName: string;
  timezone: string;
  onReset: () => void;
  onBack: () => void;
}

export function ExportPanel({
  events,
  courseName,
  timezone,
  onReset,
  onBack,
}: ExportPanelProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Export Events</h2>
        <p className="text-muted-foreground">
          {events.length} events ready to export for{" "}
          <span className="text-primary font-medium">{courseName}</span>
        </p>
      </div>

      {/* Primary: Download ICS */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={() => downloadICS(events, courseName)}
          className="text-lg px-8 py-6 cursor-pointer"
        >
          Download ICS File
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Import this file into Google Calendar, Apple Calendar, or Outlook
      </p>

      {/* Per-event export */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Or add events individually</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
          {events.map((event) => (
            <Card key={event.id} className="bg-card">
              <CardContent className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <a
                    href={googleCalendarUrl(event, timezone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    Google
                  </a>
                  <a
                    href={outlookCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs px-2 py-1 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors"
                  >
                    Outlook
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="cursor-pointer">
          Back to Review
        </Button>
        <Button variant="outline" onClick={onReset} className="cursor-pointer">
          Start Over
        </Button>
      </div>
    </div>
  );
}
