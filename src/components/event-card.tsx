"use client";

import { CalendarEvent } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge } from "./confidence-badge";
import { googleCalendarUrl, outlookCalendarUrl } from "@/lib/calendar-links";

interface EventCardProps {
  event: CalendarEvent;
  timezone: string;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

const typeColors: Record<string, string> = {
  assignment: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  exam: "bg-red-500/15 text-red-400 border-red-500/30",
  quiz: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  lab: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  project: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  other: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function EventCard({
  event,
  timezone,
  onEdit,
  onDelete,
  onToggle,
}: EventCardProps) {
  return (
    <Card
      className={`transition-all ${
        event.selected
          ? "border-primary/30 bg-card"
          : "border-border/50 bg-card/50 opacity-60"
      }`}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header: checkbox + type + confidence */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={event.selected}
              onChange={onToggle}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
            <Badge variant="outline" className={typeColors[event.type] || typeColors.other}>
              {event.type}
            </Badge>
          </div>
          <ConfidenceBadge level={event.confidence} />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm leading-tight">{event.title}</h3>

        {/* Date/Time */}
        <div className="text-sm text-muted-foreground">
          <p>{formatDate(event.startDate)}</p>
          {!event.isAllDay && (
            <p className="text-xs">{formatTime(event.startDate)}</p>
          )}
          {event.isAllDay && (
            <p className="text-xs text-muted-foreground/70">All day</p>
          )}
        </div>

        {/* Location */}
        {event.location && (
          <p className="text-xs text-muted-foreground/70">{event.location}</p>
        )}

        {/* Source snippet */}
        <p className="text-xs text-muted-foreground/50 italic truncate">
          &ldquo;{event.sourceSnippet}&rdquo;
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-1 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-xs h-7 cursor-pointer"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-xs h-7 text-destructive hover:text-destructive cursor-pointer"
          >
            Delete
          </Button>
          <a
            href={googleCalendarUrl(event, timezone)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-xs h-7 px-2 rounded-md hover:bg-accent transition-colors text-blue-400"
          >
            Google
          </a>
          <a
            href={outlookCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-xs h-7 px-2 rounded-md hover:bg-accent transition-colors text-sky-400"
          >
            Outlook
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
