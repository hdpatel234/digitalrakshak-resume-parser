import { NextResponse } from "next/server";
import { mockParsedResume } from "@/data/mock-resume";

export async function POST(request: Request) {
  try {
    // In a real app, this might accept a fileId or the file itself
    const body = await request.json().catch(() => ({}));
    void body;

    // Simulate AI parsing delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Simulate a random parsing failure (10% chance) for realism
    if (Math.random() < 0.1) {
      return NextResponse.json(
        { error: "Failed to extract text. The document may be corrupted or encrypted." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Resume parsed successfully",
      data: {
        jobId: `job_${Date.now()}`,
        status: "completed",
        result: mockParsedResume,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse resume" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Extract ID from query params, e.g. ?id=123
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Simulate DB fetch delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!id) {
    return NextResponse.json({ error: "Missing resume ID" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    data: mockParsedResume,
  });
}
