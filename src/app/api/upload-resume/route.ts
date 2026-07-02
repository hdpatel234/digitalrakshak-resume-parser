import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Simulate upload delay (network latency)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate successful upload and return a job/file ID
    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        fileId: `file_${Date.now()}`,
        fileName: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
