"use client";

import { useState } from "react";
import { CalendarEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "./event-card";
import { EventEditDialog } from "./event-edit-dialog";

interface ReviewGridProps {
  events: CalendarEvent[];
  timezone: string;
  onUpdate: (id: string, updated: Partial<CalendarEvent>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onExport: () => void;
  onBack: () => void;
}

const eventTypes = ["all", "assignment", "exam", "quiz", "lab", "project", "other"] as const;

export function ReviewGrid({
  events,
  timezone,
  onUpdate,
  onDelete,
  onToggle,
  onExport,
  onBack,
}: ReviewGridProps) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const filtered =
    typeFilter === "all"
      ? events
      : events.filter((e) => e.type === typeFilter);

  const selectedCount = events.filter((e) => e.selected).length;

  const selectAll = () => {
    events.forEach((e) => {
      if (!e.selected) onToggle(e.id);
    });
  };

  const deselectAll = () => {
    events.forEach((e) => {
      if (e.selected) onToggle(e.id);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Review Events</h2>
          <p className="text-sm text-muted-foreground">
            {events.length} events found &middot; {selectedCount} selected
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={selectAll} className="cursor-pointer">
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={deselectAll} className="cursor-pointer">
            Deselect All
          </Button>
        </div>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap">
        {eventTypes.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className="cursor-pointer"
          >
            <Badge
              variant={typeFilter === type ? "default" : "outline"}
              className="capitalize cursor-pointer"
            >
              {type}
              {type !== "all" && (
                <span className="ml-1 opacity-60">
                  ({events.filter((e) => e.type === type).length})
                </span>
              )}
            </Badge>
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            timezone={timezone}
            onEdit={() => setEditingEvent(event)}
            onDelete={() => onDelete(event.id)}
            onToggle={() => onToggle(event.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No events match the current filter.
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="cursor-pointer">
          Back
        </Button>
        <Button
          onClick={onExport}
          disabled={selectedCount === 0}
          className="cursor-pointer"
        >
          Export {selectedCount} Events
        </Button>
      </div>

      {/* Edit dialog */}
      <EventEditDialog
        event={editingEvent}
        open={editingEvent !== null}
        onSave={onUpdate}
        onClose={() => setEditingEvent(null)}
      />
    </div>
  );
}
