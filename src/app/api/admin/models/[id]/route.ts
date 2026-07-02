import { NextResponse } from "next/server";
import { providerService } from "@/server/services/provider.service";
import { auth } from "@/lib/auth/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session || ((session.user as any)?.role !== "admin" && (session.user as any)?.role !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    
    const updatedModel = await providerService.updateModel(resolvedParams.id, {
      isActive: data.isActive,
      costPerRequest: data.costPerRequest,
      maxRequestsPerMin: data.maxRequestsPerMin,
      maxDailyLimit: data.maxDailyLimit,
      tokenLimit: data.tokenLimit
    });

    return NextResponse.json(updatedModel);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
