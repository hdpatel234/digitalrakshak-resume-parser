import { NextResponse } from "next/server";
import { providerService } from "@/server/services/provider.service";
import { auth } from "@/lib/auth/auth";

export async function POST(req: Request, { params }: { params: Promise<{ accountId: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session || ((session.user as any)?.role !== "admin" && (session.user as any)?.role !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reqBody = await req.json();
  const { key, priority } = reqBody;
  if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 });

  const newKey = await providerService.addApiKey({
    providerAccountId: resolvedParams.accountId,
    rawKey: key,
    priority: priority || 0,
    limitRequestsDaily: reqBody.limitRequestsDaily || null,
    limitRequestsPerMin: reqBody.limitRequestsPerMin || null,
    limitRequestsPerHour: reqBody.limitRequestsPerHour || null,
    limitRequestsPerMonth: reqBody.limitRequestsPerMonth || null
  });
  
  // Mask the newly created key in response for security
  return NextResponse.json({
    id: newKey.id,
    isActive: newKey.isActive,
    priority: newKey.priority,
    createdAt: newKey.createdAt
  }, { status: 201 });
}
