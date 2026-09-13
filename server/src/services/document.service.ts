import fs from "fs/promises";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { createWorker } from "tesseract.js";

/**
 * Extracts raw textual content from uploaded PDF, DOCX, PPTX, or plain text files.
 * If a PDF is scanned (has little to no embedded text), automatically runs Tesseract OCR.
 */
export async function extractTextFromFile(
  filePath: string,
  mimeType: string,
  originalName: string
): Promise<{ text: string; isScannedPdf: boolean }> {
  const buffer = await fs.readFile(filePath);
  const ext = originalName.toLowerCase().split(".").pop() || "";
  let extractedText = "";
  let isScannedPdf = false;

  try {
    if (mimeType === "application/pdf" || ext === "pdf") {
      // 1. Attempt native PDF text parsing
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text || "";
      } catch (pdfErr) {
        console.warn("pdf-parse encountered an error, falling back to OCR:", pdfErr);
      }

      // 2. If PDF contains less than 60 characters, it is likely a scanned/image-based PDF
      if (extractedText.trim().length < 60) {
        console.log("📄 Detected scanned/image PDF. Initiating Tesseract OCR engine...");
        isScannedPdf = true;
        try {
          const worker = await createWorker("eng");
          const ret = await worker.recognize(buffer);
          extractedText = ret.data.text || "";
          await worker.terminate();
          console.log(`✅ Tesseract OCR extracted ${extractedText.length} characters.`);
        } catch (ocrErr: any) {
          console.warn("⚠️ Tesseract OCR failed on PDF buffer:", ocrErr.message);
          // If OCR fails, keep whatever text was initially parsed
        }
      }
    } else if (
      ext === "docx" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // DOCX Parsing with Mammoth
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || "";
    } else if (ext === "pptx" || mimeType.includes("presentation")) {
      // PPTX Parsing (Extract UTF-8 XML text fragments)
      const content = buffer.toString("utf-8");
      const matched = content.match(/<a:t>([^<]+)<\/a:t>/g);
      if (matched && matched.length > 0) {
        extractedText = matched.map((m) => m.replace(/<\/?a:t>/g, "")).join(" ");
      } else {
        // Fallback to text clean
        extractedText = content.replace(/[^\x20-\x7E\n]/g, " ").replace(/\s+/g, " ");
      }
    } else {
      // Plain text / Markdown
      extractedText = buffer.toString("utf-8");
    }
  } catch (err: any) {
    console.error("❌ Document extraction failed:", err);
    throw new Error(`Failed to extract text from document: ${err.message}`);
  }

  // Clean up excessive whitespace
  const sanitized = extractedText.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();

  if (!sanitized || sanitized.length < 20) {
    throw new Error(
      "Could not extract sufficient readable text from this file. Please ensure the document is not password-protected or empty."
    );
  }

  return {
    text: sanitized,
    isScannedPdf
  };
}
