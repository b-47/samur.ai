# Samur.ai — PRD (Updated with Google/Outlook export buttons)

## 1) One-liner
**Samur.ai** turns pasted syllabus text into clean calendar events (assignments and/or assessments) and lets students export via **ICS** plus **one-click “Add to Google Calendar / Add to Outlook” buttons (per event)**—built around a focus/productivity “samurai” theme.

---

## 2) Problem
UIUC provides an ICS export for **lecture/lab meeting times**, but **deadlines and exams** live in syllabi. Students manually copy dates into calendars, leading to missed deadlines and wasted time.

---

## 3) Target users
**Primary**
- UIUC students using Google Calendar / Outlook / Apple Calendar to manage coursework.

**Secondary**
- Any college student dealing with multiple courses and frequent deliverables.

---

## 4) Goals / Success metrics
### Goals
- Convert syllabus text into structured events quickly and reliably.
- Give users control: extract **Assignments**, **Assessments**, or **Both**.
- Make exporting frictionless with:
  - **Download ICS (bulk import)**
  - **Add to Google Calendar (single-event deep link)**
  - **Add to Outlook Calendar (single-event deep link)**

### Success metrics
- Paste → export in **≤ 60 seconds**
- User accepts/edit-confirms **≥ 80%** of events without major corrections
- ICS imports into Google Calendar without errors; deep-link buttons open pre-filled event forms correctly

---

## 5) Non-goals (MVP)
- Full OAuth calendar write (Google Calendar API / Microsoft Graph)
- LMS integrations (Canvas)
- Perfect handling of ambiguous dates like “Week 3 Friday”
- Automatic study block generation (stretch only)

---

## 6) MVP user flow
### Flow A — Paste → Review → Export
1. **Import screen**
   - Course name (e.g., “CS 374”)
   - Semester (default: current semester)
   - Timezone (default: America/Chicago)
   - Event type filter: **Assignments / Assessments / Both**
   - Paste syllabus text
2. **Extract**
   - AI returns a list of candidate events with confidence + source snippet
3. **Review screen**
   - Filter by type and confidence
   - Inline edit: title, date, time, location, type
   - Delete incorrect events
4. **Export screen**
   - Primary: **Download ICS (All Confirmed Events)**
   - Secondary: **Per-event buttons**:
     - “Add to Google Calendar” (opens Google event-create URL)
     - “Add to Outlook” (opens Outlook web event compose URL / best-effort deep link)

### Flow B — Fast path (optional)
- If confidence is high, allow “Export immediately” but still offer “Review & edit.”

---

## 7) Feature set
### MVP (must ship)
1. **Syllabus input**
   - Text paste required
2. **AI extraction (Gemini API)**
   - Strict JSON output with fields:
     - `title`
     - `type`: assignment | exam | quiz | lab | other
     - `start` (datetime) and optional `end`
     - `due` (datetime) for deadlines (if your model uses due vs start)
     - `location` (optional)
     - `notes` (optional)
     - `confidence`
     - `source_snippet`
3. **Review + editing UI**
   - Quick filters and inline edit
4. **Export**
   - **Bulk export**: ICS file for all confirmed events
   - **Single-event export**: deep link buttons for Google/Outlook per event

### Stretch (only if ahead)
- PDF upload (extract text)
- Study blocks before exams (simple heuristics)

---

## 8) Google / Outlook “Export” (Option 1 spec)
### What “Add to Google Calendar” means
- A button that opens a **pre-filled Google Calendar event creation page** in a new tab.
- Works for **single events** only (one click = one event form).

**Required event mapping**
- Title → `text`
- Start/end → `dates` (or start datetime + end datetime)
- Location → `location`
- Notes → `details`

**UX placement**
- On the **Review screen**, each event row shows:
  - `Add to Google`
  - `Add to Outlook`
- On the **Export screen**, include:
  - “Add next upcoming exam to Google/Outlook” as a convenient shortcut.

### What “Add to Outlook” means
- A button that opens the closest supported **Outlook web compose event** experience with pre-filled fields.
- Also single-event only.

**Required event mapping**
- Subject/title
- Start/end
- Location
- Body/notes

### Key constraint (explicit)
- These buttons **do not batch-add all events**. For adding everything at once, users use **Download ICS**.

---

## 9) UX / UI requirements (Best UI/UX)
### Design principles
- Fast, minimal steps
- Trust: show confidence + source snippet
- “Samurai focus” theme (clean, sharp, calm)

### Pages
1. **Landing**
   - Value prop
   - CTA: “Paste syllabus”
2. **Import**
   - Course + filter + paste box
3. **Review**
   - List/table with:
     - Type chip, date/time, title, confidence
     - Inline edit
     - Per-event Google/Outlook buttons
4. **Export**
   - Download ICS
   - Optional quick-add for next exam

### Accessibility basics
- Keyboard navigation
- Contrast-compliant dark theme
- Clear error states

---

## 10) Technical plan
### Architecture
- **Frontend**: Next.js (React)
- **Backend**: Next.js API routes (or Express)
- **AI**: Gemini API server-side
- **ICS generation**: Node library (`ics` or `ical-generator`)
- **No DB required** for MVP (events live in client state)

### Data flow
1. Client → `/api/extract` with syllabus text + options
2. Backend → Gemini → JSON events
3. Client review/edit
4. Client → `/api/ics` with confirmed events
5. Backend returns downloadable `.ics`

### Deep link generation (frontend)
- For each event, generate:
  - `googleUrl(event)`
  - `outlookUrl(event)`
- Open in new tab with `target="_blank"`.

---

## 11) Requirements
### Functional requirements
- FR1: User can paste syllabus and select extraction type(s).
- FR2: System extracts events and displays them with confidence + snippet.
- FR3: User can edit/delete events.
- FR4: System generates valid ICS for confirmed events.
- FR5: Each event has a working **Google** and **Outlook** deep link button (pre-filled event).

### Non-functional requirements
- NFR1: Extraction completes in < 10 seconds typical.
- NFR2: Syllabus text not stored by default.
- NFR3: Robustness to malformed AI JSON (retry + validation).

---

## 12) Edge cases
- Missing time → default:
  - assignments: 11:59 PM local time
  - exams: all-day or require edit if time missing
- Ambiguous dates → low confidence + highlight for edit
- Duplicates → dedup by (title, date)

---

## 13) Gemini API usage (Best Use of Gemini)
Gemini is used for **structured extraction and normalization**:
- return strict JSON schema
- infer event type
- extract location/notes
- provide confidence + snippet for user trust

---

## 14) Deployment (Aedify)
- Deploy Next.js app with live domain
- Env vars:
  - `GEMINI_API_KEY`
- Demo script must show:
  - paste → extracted list → click Google button → download ICS

---

## 15) Brand / theme
**Name:** Samur.ai  
**Motto ideas:**
- “Cut through the clutter.”
- “Focus, sharpened.”

Visual direction:
- Dark mode
- Minimal “dojo” UI
- Subtle “slice” animation when extraction completes
