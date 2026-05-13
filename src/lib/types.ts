export interface CalendarEvent {
  id: string;
  title: string;
  type: "assignment" | "exam" | "quiz" | "lab" | "project" | "other";
  startDate: string; // ISO 8601
  endDate?: string | null; // ISO 8601
  dueDate?: string | null; // ISO 8601
  isAllDay: boolean;
  location?: string | null;
  notes?: string | null;
  confidence: "high" | "medium" | "low";
  sourceSnippet: string;
  selected: boolean;
}

export interface ExtractionRequest {
  syllabusText: string;
  courseName: string;
  semester: string;
  semesterStartDate: string; // e.g. "2026-01-20"
  timezone: string;
  eventTypes: "assignments" | "assessments" | "both";
}

export interface ExtractionResponse {
  events: CalendarEvent[];
  error?: string;
}
