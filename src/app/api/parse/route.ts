import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { parserService } from "@/server/services/parser.service";
import { auth } from "@/lib/auth/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = (session.user as any).tenantId;

  try {
    const formData = await req.formData();
    
    const file = formData.get("file") as File;
    const providerName = formData.get("providerName") as string || "Gemini"; // Default for testing
    const modelName = formData.get("modelName") as string || "gemini-1.5-pro";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Execute the full parsing engine pipeline
    const parsedResult = await parserService.processResume({
      tenantId,
      fileName: file.name,
      fileBuffer,
      providerName,
      modelName
    });

    return NextResponse.json({
      success: true,
      message: "Resume parsed successfully.",
      data: parsedResult.data
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
