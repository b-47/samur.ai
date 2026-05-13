"use client";

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

interface ImportFormProps {
  onSubmit: (formData: FormData) => void;
  loading: boolean;
}

const timezones = [
  { label: "Central (Chicago)", value: "America/Chicago" },
  { label: "Eastern (New York)", value: "America/New_York" },
  { label: "Mountain (Denver)", value: "America/Denver" },
  { label: "Pacific (Los Angeles)", value: "America/Los_Angeles" },
];

export function ImportForm({ onSubmit, loading }: ImportFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("courseName", "STAT 200");
    formData.set("semester", "Spring 2026");
    formData.set("semesterStartDate", "2026-01-20");
    formData.set("timezone", "America/Chicago");
    formData.set("eventTypes", "both");
    formData.set("demo", "true");
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Demo mode notice */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/8 px-4 py-3">
        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
          Demo mode
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          AI extraction is currently disabled to reduce upkeep costs and prevent misuse.
          The STAT 200 Spring 2026 syllabus is pre-loaded below. Hit{" "}
          <span className="font-medium">Extract Events</span> to see what it can do!
        </p>
      </div>

      <fieldset disabled className="space-y-6 opacity-50 pointer-events-none">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="courseName">Course Name</Label>
            <Input id="courseName" value="STAT 200" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Select value="Spring 2026">
              <SelectTrigger id="semester">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spring 2026">Spring 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="semesterStart">First Day of Classes</Label>
            <Input id="semesterStart" type="date" value="2026-01-20" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value="America/Chicago">
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Event Types</Label>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(["both", "assignments", "assessments"] as const).map((type) => (
              <div
                key={type}
                className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium text-center capitalize ${
                  type === "both"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {type}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Syllabus</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-primary font-medium">
                Stat200S26 Syllabus.pdf
              </span>
              <span className="text-sm text-muted-foreground">pre-loaded</span>
            </div>
          </div>
        </div>
      </fieldset>

      <Button
        type="submit"
        size="lg"
        className="w-full text-lg py-6 cursor-pointer"
        disabled={loading}
      >
        Extract Events
      </Button>
    </form>
  );
}
