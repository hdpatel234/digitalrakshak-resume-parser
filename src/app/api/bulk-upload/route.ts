import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    
    // Check if it's a ZIP file or multiple files
    const zipFile = formData.get("zipFile") as File;

    if (!files.length && !zipFile) {
      return NextResponse.json(
        { error: "No files provided for bulk upload" },
        { status: 400 }
      );
    }

    const fileCount = zipFile ? Math.floor(Math.random() * 50) + 10 : files.length; // Fake count if ZIP

    // Simulate bulk upload processing delay (longer than single)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return NextResponse.json({
      success: true,
      message: "Bulk upload initiated successfully",
      data: {
        batchId: `batch_${Date.now()}`,
        totalFilesFound: fileCount,
        status: "processing",
        estimatedCompletionTime: `${fileCount * 1.5}s`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process bulk upload" },
      { status: 500 }
    );
  }
}
