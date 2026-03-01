import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildExtractionPrompt } from "@/lib/gemini-prompt";
import { deduplicateEvents } from "@/lib/dedup";
import { CalendarEvent } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function POST(request: NextRequest) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  try {
    const contentType = request.headers.get("content-type") || "";
    let courseName: string;
    let semester: string;
    let semesterStartDate: string;
    let timezone: string;
    let eventTypes: string;
    let syllabusText: string | undefined;
    let pdfBase64: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      courseName = formData.get("courseName") as string;
      semester = formData.get("semester") as string;
      semesterStartDate = formData.get("semesterStartDate") as string;
      timezone = formData.get("timezone") as string;
      eventTypes = formData.get("eventTypes") as string;
      syllabusText = formData.get("syllabusText") as string || undefined;

      const pdfFile = formData.get("pdfFile") as File | null;
      if (pdfFile) {
        const buffer = await pdfFile.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        pdfBase64 = btoa(binary);
      }
    } else {
      const body = await request.json();
      courseName = body.courseName;
      semester = body.semester;
      semesterStartDate = body.semesterStartDate;
      timezone = body.timezone;
      eventTypes = body.eventTypes;
      syllabusText = body.syllabusText;
    }

    if (!courseName || (!syllabusText && !pdfBase64)) {
      return NextResponse.json(
        { events: [], error: "Course name and syllabus (text or PDF) are required." },
        { status: 400 }
      );
    }

    const prompt = buildExtractionPrompt({
      courseName,
      semester,
      semesterStartDate,
      timezone,
      eventTypes: eventTypes as "assignments" | "assessments" | "both",
      syllabusText: syllabusText || "(See attached PDF)",
    });

    // Build contents array for Gemini
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
      { text: prompt },
    ];

    if (pdfBase64) {
      parts.push({
        inlineData: {
          mimeType: "application/pdf",
          data: pdfBase64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json(
        { events: [], error: "Empty response from Gemini." },
        { status: 500 }
      );
    }

    let rawEvents: Array<Record<string, unknown>>;
    try {
      rawEvents = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { events: [], error: "Failed to parse Gemini response as JSON." },
        { status: 500 }
      );
    }

    if (!Array.isArray(rawEvents)) {
      return NextResponse.json(
        { events: [], error: "Gemini response is not an array." },
        { status: 500 }
      );
    }

    const events: CalendarEvent[] = rawEvents.map((e, i) => ({
      id: crypto.randomUUID?.() ?? `event-${Date.now()}-${i}`,
      title: String(e.title || "Untitled Event"),
      type: validateType(e.type),
      startDate: String(e.startDate || ""),
      endDate: e.endDate ? String(e.endDate) : undefined,
      dueDate: e.dueDate ? String(e.dueDate) : undefined,
      isAllDay: Boolean(e.isAllDay),
      location: e.location ? String(e.location) : undefined,
      notes: e.notes ? String(e.notes) : undefined,
      confidence: validateConfidence(e.confidence),
      sourceSnippet: String(e.sourceSnippet || e.source_snippet || ""),
      selected: true,
    }));

    const dedupedEvents = deduplicateEvents(events);

    return NextResponse.json({ events: dedupedEvents });
  } catch (error) {
    console.error("Extraction error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { events: [], error: `Extraction failed: ${message}` },
      { status: 500 }
    );
  }
}

function validateType(type: unknown): CalendarEvent["type"] {
  const valid = ["assignment", "exam", "quiz", "lab", "project", "other"];
  return valid.includes(String(type)) ? (String(type) as CalendarEvent["type"]) : "other";
}

function validateConfidence(confidence: unknown): CalendarEvent["confidence"] {
  const valid = ["high", "medium", "low"];
  return valid.includes(String(confidence))
    ? (String(confidence) as CalendarEvent["confidence"])
    : "medium";
}
