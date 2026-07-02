import { prisma } from "@/lib/db/prisma";
import { fileExtractor } from "@/lib/parser/extractor";
import { aiAdapter } from "@/lib/parser/ai-adapter";
import { billingService } from "@/server/services/billing.service";

// Define how many credits a standard resume parse costs
const CREDITS_PER_PARSE = 1;

export class ParserService {
  /**
   * Orchestrates the entire Resume Parsing pipeline: Billing Check -> Storage -> Extraction -> AI -> Deduction -> DB
   */
  async processResume(params: {
    tenantId: string;
    fileName: string;
    fileBuffer: Buffer;
    providerName: string; // The provider requested by the tenant
    modelName: string;    // The model requested by the tenant
  }) {
    // 1. Billing Pre-check: Fail immediately if insufficient funds
    const hasCredits = await billingService.hasSufficientCredits(params.tenantId, CREDITS_PER_PARSE);
    if (!hasCredits) {
      throw new Error("Insufficient credits. Please top up your wallet to parse resumes.");
    }

    // 2. Create Upload Record (Processing State)
    const upload = await prisma.resumeUpload.create({
      data: {
        tenantId: params.tenantId,
        fileName: params.fileName,
        status: "PROCESSING"
      }
    });

    try {
      // 3. Extract Text from File
      const rawText = await fileExtractor.extractText(params.fileBuffer, params.fileName);

      // Save raw text to DB early in case AI fails
      await prisma.resumeUpload.update({
        where: { id: upload.id },
        data: { rawText }
      });

      // 4. Send to AI Provider
      const { parsedData, rawAIResponse } = await aiAdapter.parseResume(
        params.providerName,
        params.modelName,
        rawText
      );

      // 5. Deduct Credits (only occurs if AI succeeds)
      await billingService.deductCredits(
        params.tenantId, 
        CREDITS_PER_PARSE, 
        "RESUME_PARSE_SUCCESS", 
        `Successfully parsed resume: ${params.fileName}`
      );

      // 6. Store the Parsed Result securely
      const result = await prisma.parsedResult.create({
        data: {
          resumeUploadId: upload.id,
          data: parsedData,
          rawResponse: rawAIResponse,
          modelUsed: params.modelName,
          tokensUsed: rawAIResponse?.usage?.total_tokens || null
        }
      });

      // 7. Mark as Completed
      await prisma.resumeUpload.update({
        where: { id: upload.id },
        data: { status: "COMPLETED" }
      });

      return result;

    } catch (error: any) {
      // Handle Failure Gracefully - No credits deducted!
      await prisma.resumeUpload.update({
        where: { id: upload.id },
        data: { 
          status: "FAILED",
          error: error.message
        }
      });
      throw error;
    }
  }
}

export const parserService = new ParserService();
