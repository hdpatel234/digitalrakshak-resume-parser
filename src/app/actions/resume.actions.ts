"use server";

import { auth } from "@/lib/auth/auth";
import { parserService } from "@/server/services/parser.service";
import { subscriptionService } from "@/server/services/subscription.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadResumeUi(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized access. Please login.");
  }

  const tenantId = (session.user as any).tenantId;

  // 1. Validate Subscription (Strict check for Web UI)
  const isSubActive = await subscriptionService.validateSubscription(tenantId);
  if (!isSubActive) {
    throw new Error("No active subscription. Please upgrade your plan to parse resumes.");
  }

  // 2. Extract Data
  const file = formData.get("file") as File;
  const providerName = formData.get("providerName") as string || "Gemini";
  const modelName = formData.get("modelName") as string || "gemini-1.5-pro";

  if (!file) {
    throw new Error("No file uploaded.");
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  // 3. Delegate to the Orchestration Engine
  // This automatically handles credit checks, key rotation, failovers, parsing, and deductions.
  try {
    await parserService.processResume({
      tenantId,
      fileName: file.name,
      fileBuffer,
      providerName,
      modelName
    });
  } catch (error: any) {
    throw new Error(`Parsing Failed: ${error.message}`);
  }

  // 4. On Success, redirect to the parsed results view
  revalidatePath("/dashboard/resumes");
  revalidatePath("/dashboard");
  redirect("/dashboard/resumes");
}
