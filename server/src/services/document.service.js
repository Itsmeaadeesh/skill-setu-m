import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

export async function extractTextFromFile(filePath, mimeType, originalName) {
  const ext = path.extname(originalName).toLowerCase();
  let extractedText = "";

  try {
    if (ext === ".pdf" || mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text || "";
    } else if (ext === ".txt" || ext === ".md" || mimeType.includes("text")) {
      extractedText = fs.readFileSync(filePath, "utf-8");
    } else {
      // For PPTX, DOCX or other binary files, read raw buffer and extract ascii strings
      const raw = fs.readFileSync(filePath);
      const str = raw.toString("utf-8");
      // Clean xml/tags if docx/pptx
      const cleaned = str.replace(/<[^>]+>/g, " ").replace(/[^\x20-\x7E\n\r\t]/g, " ");
      const words = cleaned.split(/\s+/).filter(w => w.length > 2 && w.length < 30);
      extractedText = words.slice(0, 3000).join(" ");
    }
  } catch (err) {
    console.error("Error parsing file:", err);
    throw new Error(`Failed to extract text from file: ${err.message}`);
  }

  // Clean and normalize text
  const normalized = extractedText
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const words = normalized.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  return {
    text: normalized,
    wordCount,
  };
}
