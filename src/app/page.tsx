"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingHero } from "@/components/landing-hero";
import { Stepper } from "@/components/stepper";
import { ImportForm } from "@/components/import-form";
import { LoadingScreen } from "@/components/loading-screen";
import { ReviewGrid } from "@/components/review-grid";
import { ExportPanel } from "@/components/export-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { CalendarEvent } from "@/lib/types";
import demoEvents from "../../stat200_extracted.json";

type Step = "landing" | "import" | "loading" | "review" | "export";

const stepIndex: Record<Step, number> = {
  landing: -1,
  import: 0,
  loading: 0,
  review: 1,
  export: 2,
};

// Diagonal katana-slash reveal: top leads, bottom follows (\-direction sweep)
const pageVariants = {
  initial: { clipPath: "polygon(0% 0%, 8% 0%, -8% 100%, 0% 100%)" },
  animate: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    clipPath: "polygon(100% 0%, 115% 0%, 95% 100%, 80% 100%)",
    transition: { duration: 0.39, ease: [0.55, 0, 1, 0.45] as const },
  },
};

export default function Home() {
  const { theme } = useTheme();
  const [step, setStep] = useState<Step>("landing");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [courseName, setCourseName] = useState("");
  const [timezone, setTimezone] = useState("America/Chicago");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setCourseName(formData.get("courseName") as string);
    setTimezone(formData.get("timezone") as string);
    setStep("loading");

    if (formData.get("demo") === "true") {
      await new Promise((resolve) => setTimeout(resolve, 2600));
      setEvents(demoEvents as CalendarEvent[]);
      setStep("review");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to extract events.");
        setStep("import");
        return;
      }

      if (data.events.length === 0) {
        setError("No events found in the syllabus. Try pasting a different section.");
        setStep("import");
        return;
      }

      setEvents(data.events);
      setStep("review");
    } catch {
      setError("Network error. Please try again.");
      setStep("import");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = (id: string, updated: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleToggleEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, selected: !e.selected } : e))
    );
  };

  const handleReset = () => {
    setEvents([]);
    setCourseName("");
    setError(null);
    setStep("landing");
  };

  return (
    <main className="min-h-screen overflow-hidden relative">
      <ThemeToggle />
      {/* Transparent cherry blossom tree — background for inner pages */}
      {step !== "landing" && (
        <div style={{ position: "fixed", bottom: 0, right: 0, width: "60%", height: "100vh", zIndex: 0, pointerEvents: "none", opacity: 0.055 }}>
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMaxYMax slice" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <defs>
              <g id="bg-flower">
                <circle cx="0" cy="-14" r="11" fill="#f5789a" />
                <circle cx="-13" cy="-4" r="11" fill="#f5789a" />
                <circle cx="13" cy="-4" r="11" fill="#f5789a" />
                <circle cx="-8" cy="12" r="11" fill="#f5789a" />
                <circle cx="8" cy="12" r="11" fill="#f5789a" />
              </g>
              <path id="bg-spetal" d="M0,0 C-8,-8 -8,-16 0,-20 C8,-16 8,-8 0,0" fill="#f5789a" />
            </defs>
            {/* Trunk and branches */}
            <g fill={theme === "dark" ? "#ffffff" : "#0c0c0c"}>
              <path d="M650,1000 L600,850 L610,800 L560,650 L580,620 L500,500 L520,490 L590,600 L650,780 L680,1000 Z" />
              <path d="M570,640 L500,580 L420,590 L350,500 L370,490 L450,560 L520,550 L585,610 Z" />
              <path d="M430,570 L380,450 L310,400 L320,380 L390,440 L450,550 Z" />
              <path d="M350,500 L280,480 L220,400 L230,380 L300,460 L360,480 Z" />
              <path d="M390,440 L350,350 L370,360 L400,430 Z" />
              <path d="M310,400 L250,320 L270,330 L320,390 Z" />
              <path d="M610,800 L700,720 L750,600 L820,480 L800,470 L730,590 L680,700 L595,760 Z" />
              <path d="M740,600 L820,550 L880,450 L860,440 L800,530 L720,580 Z" />
              <path d="M700,720 L780,680 L840,650 L830,630 L760,660 Z" />
              <path d="M880,450 L950,400 L940,390 L875,440 Z" />
              <path d="M500,500 L450,400 L460,300 L480,310 L470,410 L515,490 Z" />
              <path d="M460,300 L420,220 L440,230 L470,310 Z" />
              <path d="M520,320 L560,250 L580,260 L530,330 Z" />
            </g>
            {/* Flowers */}
            <use href="#bg-flower" transform="translate(220, 400) scale(1.1)" />
            <use href="#bg-flower" transform="translate(280, 480) scale(0.9)" />
            <use href="#bg-flower" transform="translate(350, 350) scale(1.3)" />
            <use href="#bg-flower" transform="translate(310, 400) scale(0.8)" />
            <use href="#bg-flower" transform="translate(250, 320) scale(1)" />
            <use href="#bg-flower" transform="translate(420, 220) scale(1.4)" />
            <use href="#bg-flower" transform="translate(470, 310) scale(1.1)" />
            <use href="#bg-flower" transform="translate(560, 250) scale(1.2)" />
            <use href="#bg-flower" transform="translate(520, 320) scale(0.9)" />
            <use href="#bg-flower" transform="translate(450, 400) scale(1.3)" />
            <use href="#bg-flower" transform="translate(750, 600) scale(1.2)" />
            <use href="#bg-flower" transform="translate(820, 550) scale(1.3)" />
            <use href="#bg-flower" transform="translate(880, 450) scale(1.1)" />
            <use href="#bg-flower" transform="translate(840, 650) scale(0.8)" />
            <use href="#bg-flower" transform="translate(950, 400) scale(1.2)" />
            <use href="#bg-flower" transform="translate(880, 580) scale(1)" />
            <use href="#bg-spetal" transform="translate(180, 380) scale(1.2) rotate(60)" />
            <use href="#bg-spetal" transform="translate(680, 500) scale(1.5) rotate(-20)" />
            <use href="#bg-spetal" transform="translate(920, 500) scale(1.2) rotate(80)" />
          </svg>
        </div>
      )}
      <AnimatePresence mode="wait" initial={false}>
        {step === "landing" && (
          <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <LandingHero onGetStarted={() => setStep("import")} />
          </motion.div>
        )}

        {(step === "import" || step === "loading") && (
          <motion.div key="import" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="max-w-4xl mx-auto px-4 py-12">
              <Stepper currentStep={stepIndex[step]} />
              {step === "loading" ? (
                <LoadingScreen />
              ) : (
                <>
                  {error && (
                    <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}
                  <ImportForm onSubmit={handleExtract} loading={loading} />
                </>
              )}
            </div>
          </motion.div>
        )}

        {step === "review" && (
          <motion.div key="review" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="max-w-6xl mx-auto px-4 py-12">
              <Stepper currentStep={stepIndex[step]} />
              <ReviewGrid
                events={events}
                timezone={timezone}
                onUpdate={handleUpdateEvent}
                onDelete={handleDeleteEvent}
                onToggle={handleToggleEvent}
                onExport={() => setStep("export")}
                onBack={() => setStep("import")}
              />
            </div>
          </motion.div>
        )}

        {step === "export" && (
          <motion.div key="export" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="max-w-4xl mx-auto px-4 py-12">
              <Stepper currentStep={stepIndex[step]} />
              <ExportPanel
                events={events.filter((e) => e.selected)}
                courseName={courseName}
                timezone={timezone}
                onReset={handleReset}
                onBack={() => setStep("review")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
