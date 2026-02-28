export interface CalendarEvent {
  id: string;
  title: string;
  type: "assignment" | "exam" | "quiz" | "lab" | "project" | "other";
  startDate: string; // ISO 8601
  endDate?: string; // ISO 8601
  dueDate?: string; // ISO 8601
  isAllDay: boolean;
  location?: string;
  notes?: string;
  confidence: "high" | "medium" | "low";
  sourceSnippet: string;
  selected: boolean;
}

export interface ExtractionRequest {
  syllabusText: string;
  courseName: string;
  semester: string;
  timezone: string;
  eventTypes: "assignments" | "assessments" | "both";
}

export interface ExtractionResponse {
  events: CalendarEvent[];
  error?: string;
}
