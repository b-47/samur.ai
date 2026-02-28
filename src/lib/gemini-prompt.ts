import { ExtractionRequest } from "./types";

export function buildExtractionPrompt(request: ExtractionRequest): string {
  const typeInstruction =
    request.eventTypes === "assignments"
      ? "Extract ONLY assignments, homework, projects, and lab submissions (deadlines/due dates). Do NOT extract exams, quizzes, or tests."
      : request.eventTypes === "assessments"
        ? "Extract ONLY exams, quizzes, tests, and midterms. Do NOT extract assignments or homework."
        : "Extract ALL academic events: assignments, homework, projects, exams, quizzes, tests, midterms, finals, and lab submissions.";

  return `You are an expert academic calendar event extractor. Your job is to extract structured calendar events from a course syllabus.

## Context
- Course: ${request.courseName}
- Semester: ${request.semester}
- Timezone: ${request.timezone}

## What to Extract
${typeInstruction}

## Rules
1. Extract ONLY events that are explicitly stated or clearly implied in the syllabus. Do not invent events.
2. For recurring patterns like "HW due every Friday" or "weekly quizzes on Monday", expand into individual events for EACH week of the semester. Use standard academic semester dates for ${request.semester}:
   - Spring semester: mid-January to early May (~16 weeks)
   - Fall semester: late August to mid-December (~16 weeks)
   - Summer semester: June to August (~8 weeks)
3. Date/time defaults:
   - Assignments with no time specified: set time to 23:59 (11:59 PM)
   - Exams with no time specified: mark as all-day events (isAllDay: true)
   - If only a week number is given (e.g., "Week 7"), span the event across that entire week (Monday to Friday)
4. Confidence levels:
   - "high": exact date and type are explicitly stated
   - "medium": date is stated but time is inferred or type is ambiguous
   - "low": date is approximate, week-based, or unclear
5. Deduplicate: if the same event appears multiple times, include it only once.
6. Include the exact source_snippet from the syllabus (verbatim, max 100 chars).
7. Prefix each event title with the course name (e.g., "${request.courseName} HW 3").

## Output Format
Return a JSON array of objects with these exact fields:
[
  {
    "title": "string - descriptive title with course prefix",
    "type": "assignment" | "exam" | "quiz" | "lab" | "project" | "other",
    "startDate": "ISO 8601 datetime string with timezone offset",
    "endDate": "ISO 8601 datetime string or null",
    "dueDate": "ISO 8601 datetime string or null",
    "isAllDay": boolean,
    "location": "string or null",
    "notes": "string or null - any additional context",
    "confidence": "high" | "medium" | "low",
    "sourceSnippet": "string - verbatim text from syllabus"
  }
]

Return ONLY the JSON array. No markdown, no explanation, no wrapping.

## Syllabus Text
${request.syllabusText}`;
}
