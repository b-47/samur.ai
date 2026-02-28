"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface PdfUploaderProps {
  onTextExtracted: (text: string) => void;
}

export function PdfUploader({ onTextExtracted }: PdfUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setFileName(file.name);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        pages.push(text);
      }

      onTextExtracted(pages.join("\n\n"));
    } catch (err) {
      console.error("PDF extraction error:", err);
      alert("Failed to extract text from PDF. Try pasting the text manually.");
      setFileName(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
      />
      {loading ? (
        <p className="text-sm text-muted-foreground">Extracting text from PDF...</p>
      ) : fileName ? (
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-primary">{fileName}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setFileName(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="cursor-pointer"
          >
            Clear
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full cursor-pointer"
        >
          <p className="text-sm text-muted-foreground">
            Drop a PDF here or{" "}
            <span className="text-primary underline">browse</span>
          </p>
        </button>
      )}
    </div>
  );
}
