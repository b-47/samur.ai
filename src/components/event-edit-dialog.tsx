"use client";

import { useState } from "react";
import { CalendarEvent } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventEditDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onSave: (id: string, updates: Partial<CalendarEvent>) => void;
  onClose: () => void;
}

export function EventEditDialog({
  event,
  open,
  onSave,
  onClose,
}: EventEditDialogProps) {
  const [title, setTitle] = useState(event?.title || "");
  const [type, setType] = useState<string>(event?.type || "other");
  const [startDate, setStartDate] = useState(
    event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : ""
  );
  const [endDate, setEndDate] = useState(
    event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : ""
  );
  const [location, setLocation] = useState(event?.location || "");
  const [notes, setNotes] = useState(event?.notes || "");
  const [isAllDay, setIsAllDay] = useState(event?.isAllDay || false);

  // Reset form when event changes
  if (event && title === "" && event.title !== "") {
    setTitle(event.title);
    setType(event.type);
    setStartDate(
      event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : ""
    );
    setEndDate(
      event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : ""
    );
    setLocation(event.location || "");
    setNotes(event.notes || "");
    setIsAllDay(event.isAllDay);
  }

  const handleSave = () => {
    if (!event) return;
    onSave(event.id, {
      title,
      type: type as CalendarEvent["type"],
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      location: location || undefined,
      notes: notes || undefined,
      isAllDay,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["assignment", "exam", "quiz", "lab", "project", "other"].map(
                  (t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allDay"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="cursor-pointer"
            />
            <Label htmlFor="allDay" className="cursor-pointer">All day</Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start</Label>
              <Input
                type={isAllDay ? "date" : "datetime-local"}
                value={isAllDay ? startDate.slice(0, 10) : startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End</Label>
              <Input
                type={isAllDay ? "date" : "datetime-local"}
                value={isAllDay ? endDate.slice(0, 10) : endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleSave} className="cursor-pointer">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
