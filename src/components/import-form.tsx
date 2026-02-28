"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtractionRequest } from "@/lib/types";
import { PdfUploader } from "./pdf-uploader";

interface ImportFormProps {
  onSubmit: (request: ExtractionRequest) => void;
  loading: boolean;
}

const semesters = [
  "Spring 2025",
  "Summer 2025",
  "Fall 2025",
  "Spring 2026",
  "Summer 2026",
  "Fall 2026",
];

const timezones = [
  { label: "Central (Chicago)", value: "America/Chicago" },
  { label: "Eastern (New York)", value: "America/New_York" },
  { label: "Mountain (Denver)", value: "America/Denver" },
  { label: "Pacific (Los Angeles)", value: "America/Los_Angeles" },
];

export function ImportForm({ onSubmit, loading }: ImportFormProps) {
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("Spring 2026");
  const [timezone, setTimezone] = useState("America/Chicago");
  const [eventTypes, setEventTypes] = useState<"assignments" | "assessments" | "both">("both");
  const [syllabusText, setSyllabusText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !syllabusText.trim()) return;
    onSubmit({ courseName, semester, timezone, eventTypes, syllabusText });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="courseName">Course Name</Label>
          <Input
            id="courseName"
            placeholder="e.g., CS 374"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger id="semester">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={timezone} onValueChange={setTimezone}>
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
        <div className="space-y-2">
          <Label>Event Types</Label>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(["both", "assignments", "assessments"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setEventTypes(type)}
                className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize cursor-pointer ${
                  eventTypes === type
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="syllabus">Syllabus Text</Label>
        <PdfUploader onTextExtracted={setSyllabusText} />
        <Textarea
          id="syllabus"
          placeholder="Paste your syllabus text here, or upload a PDF above..."
          value={syllabusText}
          onChange={(e) => setSyllabusText(e.target.value)}
          rows={12}
          required
          className="resize-none"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full text-lg py-6 cursor-pointer"
        disabled={loading || !courseName.trim() || !syllabusText.trim()}
      >
        Extract Events
      </Button>
    </form>
  );
}
