const pdfParse = require("pdf-parse");
import mammoth from "mammoth";

export class FileExtractor {
  /**
   * Extracts raw text from a PDF, DOC, or DOCX buffer in memory.
   */
  async extractText(fileBuffer: Buffer, fileName: string): Promise<string> {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (!extension) {
      throw new Error("Unable to determine file type from filename.");
    }

    try {
      if (extension === "pdf") {
        return await this.extractPdf(fileBuffer);
      } else if (extension === "doc" || extension === "docx") {
        return await this.extractDoc(fileBuffer);
      } else {
        throw new Error(`Unsupported file type: .${extension}. Only PDF, DOC, and DOCX are supported.`);
      }
    } catch (error: any) {
      throw new Error(`Text extraction failed: ${error.message}`);
    }
  }

  private async extractPdf(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text.trim();
  }

  private async extractDoc(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }
}

export const fileExtractor = new FileExtractor();
