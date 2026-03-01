"use client";

import { useState, useRef } from "react";
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

interface ImportFormProps {
  onSubmit: (formData: FormData) => void;
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

function inferCourseNameFromPdf(fileName: string): string | null {
  const withoutExt = fileName.replace(/\.[^.]+$/, "");
  const normalized = withoutExt
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const compact = normalized.replace(/\s+/g, "");
  const compactMatch = compact.match(/([A-Za-z]{2,6})(\d{2,4})(?:[A-Za-z]\d{2})?/);
  if (compactMatch) {
    return `${compactMatch[1].toUpperCase()} ${compactMatch[2]}`;
  }

  const stripped = normalized
    .replace(
      /\b(syllabus|syllabi|outline|schedule|calendar|spring|summer|fall|winter|session|draft|final|updated)\b/gi,
      " "
    )
    .replace(/\b20\d{2}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const spacedMatch = stripped.match(/\b([A-Za-z]{2,6})\s*(\d{2,4}[A-Za-z]?)\b/);
  if (spacedMatch) {
    return `${spacedMatch[1].toUpperCase()} ${spacedMatch[2].toUpperCase()}`;
  }

  return null;
}

export function ImportForm({ onSubmit, loading }: ImportFormProps) {
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("Spring 2026");
  const [semesterStartDate, setSemesterStartDate] = useState("2026-01-20");
  const [timezone, setTimezone] = useState("America/Chicago");
  const [eventTypes, setEventTypes] = useState<"assignments" | "assessments" | "both">("both");
  const [syllabusText, setSyllabusText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<"text" | "pdf">("text");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasInput = inputMode === "pdf" ? !!pdfFile : !!syllabusText.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !hasInput) return;

    const formData = new FormData();
    formData.set("courseName", courseName);
    formData.set("semester", semester);
    formData.set("semesterStartDate", semesterStartDate);
    formData.set("timezone", timezone);
    formData.set("eventTypes", eventTypes);

    if (inputMode === "pdf" && pdfFile) {
      formData.set("pdfFile", pdfFile);
    } else {
      formData.set("syllabusText", syllabusText);
    }

    onSubmit(formData);
  };

  const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

  const acceptPdf = (file: File) => {
    if (file.type !== "application/pdf") return;
    if (file.size > MAX_PDF_BYTES) {
      alert(`PDF is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please upload a file under 10 MB.`);
      return;
    }
    setPdfFile(file);
    setInputMode("pdf");
    const inferredCourseName = inferCourseNameFromPdf(file.name);
    if (inferredCourseName && !courseName.trim()) {
      setCourseName(inferredCourseName);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) acceptPdf(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) acceptPdf(file);
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
          <Label htmlFor="semesterStart">First Day of Classes</Label>
          <Input
            id="semesterStart"
            type="date"
            value={semesterStartDate}
            onChange={(e) => setSemesterStartDate(e.target.value)}
            required
          />
        </div>
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

      {/* Input mode toggle */}
      <div className="space-y-2">
        <Label>Syllabus Input</Label>
        <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
          <button
            type="button"
            onClick={() => setInputMode("text")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              inputMode === "text"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Paste Text
          </button>
          <button
            type="button"
            onClick={() => setInputMode("pdf")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              inputMode === "pdf"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upload PDF
          </button>
        </div>
      </div>

      {inputMode === "text" ? (
        <Textarea
          id="syllabus"
          placeholder="Paste your syllabus text here..."
          value={syllabusText}
          onChange={(e) => setSyllabusText(e.target.value)}
          rows={12}
          className="resize-none"
        />
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {pdfFile ? (
            <div className="flex items-center justify-center gap-3">
              <span className="text-primary font-medium">{pdfFile.name}</span>
              <span className="text-sm text-muted-foreground">
                ({(pdfFile.size / 1024).toFixed(0)} KB)
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPdfFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="cursor-pointer"
              >
                Remove
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full cursor-pointer py-4"
            >
              <p className="text-muted-foreground mb-1">
                Drop a PDF here or{" "}
                <span className="text-primary underline">browse</span>
              </p>
              <p className="text-xs text-muted-foreground/60">
                PDF is sent directly to Gemini for better table/formatting understanding
              </p>
            </button>
          )}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full text-lg py-6 cursor-pointer"
        disabled={loading || !courseName.trim() || !hasInput}
      >
        Extract Events
      </Button>
    </form>
  );
}
