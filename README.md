# Samur.ai 🌸

Cut through the clutter.

Samur.ai extracts assignment and exam deadlines from course syllabi and turns them into calendar events in seconds.

Live Site: https://samur--ai.tech/  
Demo: https://youtu.be/JRgR3coU1pg  
HackIllinois Submission: https://devpost.com/software/samur-ai  

---

## The Problem

Every semester, students manually copy deadlines from syllabus PDFs into their calendars. It’s repetitive, time-consuming, and easy to get wrong. Important dates are often buried in dense formatting or tables, and missing one can have real academic consequences.

---

## What Samur.ai Does

1. Upload a syllabus PDF or paste raw text.
2. AI extracts assignments, exams, and due dates.
3. Review extracted events with confidence scores.
4. Export directly to:
   - Google Calendar  
   - Outlook  
   - Standard `.ics` file  

No manual copying. No formatting headaches.

---

## How It Works

- **Frontend:** Next.js + React  
- **Styling:** Tailwind CSS  
- **AI Processing:** Google Gemini Flash 2.5  

Syllabi are sent to Gemini Flash 2.5, which parses unstructured text and identifies temporal patterns such as due dates, exam times, and recurring assignments. The model returns structured JSON that is validated before generating calendar events.

Each event includes a confidence score so users can review uncertain extractions before exporting.

---

## Challenges

- Handling recurring deadlines (e.g., “Homework due every Friday”)
- Extracting reliable structure from complex PDF layouts
- Prompt engineering to consistently produce strict, valid JSON output

---

## What We’re Proud Of

- A confidence scoring system that flags uncertain dates for review
- A streamlined PDF upload flow that feeds directly into the model
- Direct calendar export with minimal friction

---

## What’s Next

- Direct LMS integration (Canvas, Blackboard)
- Automatic study block scheduling before major exams
- Improved recurring event detection and validation

---

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/barmanax/samur.ai.git
cd samur.ai
```

### 2. Install dependencies
```
npm install
```

### 3. Add environment variables

Create a `.env.local` file in the root directory:

```
GEMINI_API_KEY=your_google_gemini_key
```

### 4. Run the development server

```
npm run dev
```

Open http://localhost:3000
