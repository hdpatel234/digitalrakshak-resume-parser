import { NextResponse } from "next/server";
import { apiKeyService } from "@/server/services/apikey.service";
import { parserService } from "@/server/services/parser.service";

export async function POST(req: Request) {
  try {
    // 1. Extract Bearer Token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid Authorization header. Expected 'Bearer sk_live_...'" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 2. Validate Key, Subscription, Credits, and Rate Limit
    // The wrapper throws an error if any check fails, automatically returning a 4xx to the client.
    let apiKey;
    try {
      apiKey = await apiKeyService.validateApiKey(token, 1);
    } catch (validationError: any) {
      const isRateLimit = validationError.message.includes("Rate limit");
      return NextResponse.json(
        { error: validationError.message }, 
        { status: isRateLimit ? 429 : 403 }
      );
    }

    const tenantId = apiKey.tenantId;

    // 3. Extract File Data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const providerName = formData.get("providerName") as string || "Gemini";
    const modelName = formData.get("modelName") as string || "gemini-1.5-pro";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded. Form-data must contain a 'file' field." }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 4. Execute Core Parser Engine
    const parsedResult = await parserService.processResume({
      tenantId,
      fileName: file.name,
      fileBuffer,
      providerName,
      modelName
    });

    // 5. Log API Usage
    await apiKeyService.logUsage(tenantId, apiKey.id, "/api/v1/parse-resume", 1);

    // 6. Return standard JSON
    return NextResponse.json({
      success: true,
      message: "Resume parsed successfully.",
      data: parsedResult.data
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
