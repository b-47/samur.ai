import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildExtractionPrompt } from "@/lib/gemini-prompt";
import { deduplicateEvents } from "@/lib/dedup";
import { CalendarEvent, ExtractionRequest } from "@/lib/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const body: ExtractionRequest = await request.json();

    if (!body.syllabusText || !body.courseName) {
      return NextResponse.json(
        { events: [], error: "Syllabus text and course name are required." },
        { status: 400 }
      );
    }

    const prompt = buildExtractionPrompt(body);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
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

function validateType(
  type: unknown
): CalendarEvent["type"] {
  const valid = ["assignment", "exam", "quiz", "lab", "project", "other"];
  return valid.includes(String(type)) ? (String(type) as CalendarEvent["type"]) : "other";
}

function validateConfidence(
  confidence: unknown
): CalendarEvent["confidence"] {
  const valid = ["high", "medium", "low"];
  return valid.includes(String(confidence))
    ? (String(confidence) as CalendarEvent["confidence"])
    : "medium";
}
